import pymongo
import certifi
from flask import *
from flask_cors import CORS
import sentry_sdk
from sentry_sdk.integrations.flask import FlaskIntegration
from dotenv import load_dotenv
from server.apis.detection import detect
from server.apis.finder import *
import os
import base64
import io
from apis.calendar_api import calendar_api
from apis.user_api import user_api
from apis.clothing_api import clothing_api

from server.database import client

load_dotenv()
sentry_sdk.init(
    dsn="https://71ed77cdaeff44e7b814cd90fce00f97@o358880.ingest.sentry.io/4504487922565120",
    integrations=[
        FlaskIntegration(),
    ],

    # Set traces_sample_rate to 1.0 to capture 100%
    # of transactions for performance monitoring.
    # We recommend adjusting this value in production.
    traces_sample_rate=1.0,

    # By default the SDK will try to use the SENTRY_RELEASE
    # environment variable, or infer a git commit
    # SHA as release, however you may want to set
    # something more human-readable.
    # release="myapp@1.0.0",
)

app = Flask(__name__)

cors = CORS(app)
# configuration
app.config['MONGO_URI'] = os.environ.get("MONGODB_URL")
# Connect to MongoDB, where client is the MongoClient object
# client = flask_pymongo.MongoClient(os.environ.get("MONGODB_URL"))

# client = pymongo.MongoClient(os.environ.get("MONGODB_URL"), tlsCAFile=certifi.where())
# mongo = PyMongo(app)
# mongo.init_app(app)

# Register the calendar_api blueprint
app.register_blueprint(calendar_api)
# Register the user_api blueprint
app.register_blueprint(user_api)
# Register the clothing_api blueprint
app.register_blueprint(clothing_api)


