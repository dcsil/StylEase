from flask import *
from flask_cors import CORS
from dotenv import load_dotenv

import os
import sys
sys.path.append('..')

# from server.app import app
from server.apis.calendar_api import calendar_api

# initialize app
load_dotenv()
app = Flask(__name__)

cors = CORS(app)
# configuration
app.config['MONGO_URI'] = os.environ.get("MONGODB_URL")
# Register the calendar_api blueprint
app.register_blueprint(calendar_api)

# Test get plan
def test_get_plan_endpoint():
    with app.test_client() as client:
        response = client.get('/api/GetPlan/643348269d79a18b19781a0c')
        print(response.data.decode('utf-8'))
        assert response.status_code == 200
        assert response.data.decode('utf-8') == '{"plan":{"createdTime":"2022-04-08","date":"2022-04-12","name":"Meeting with Professor Zhou","occasion":"","planned_outfits":["642923806fc81a6ea84a433e"],"user":"64237961038602a02a81cd92"},"status":"success"}\n'
