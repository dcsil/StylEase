from datetime import datetime

from bson import ObjectId
import flask_pymongo
from flask import *
from flask_cors import CORS
from flask_pymongo import PyMongo
import sentry_sdk
from sentry_sdk.integrations.flask import FlaskIntegration
from dotenv import load_dotenv
from server.AI.detection import detect
from server.tool_box.finder import *
import os
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
client = flask_pymongo.MongoClient(os.environ.get("MONGODB_URL"))
# mongo = PyMongo(app)

@app.route('/api/test/<name>', methods=['GET'])
def test(name):
    target = client.sample_mflix.comments.find_one({'name': name})
    return target['text']

# GET carries request parameter appended in URL string while POST carries request parameter in message body

# Calendar Methods
# Updating methods
@app.route('/api/createOccasion', methods=['POST'])
def createOccasion():
    body = request.get_json()
    userid = body['userid']
    date = body['date']
    # occasion in the format if {'name': 'Birthday Party', 'date': '2021-03-15', 'planned_outfits': [], 'place': 'Home'}
    occasion = body['occasion']
    # Insert the occasion to db.occasions
    occasion_id = client.db.occasions.insert_one(occasion).inserted_id
    # Find the day of the user
    target = client.db.calendar.find_one({'user': userid})
    date_db = find_day_by_date(client, target, date)
    data_db_id = date_db['_id']
    # Add the occasion to the day
    current_occasions = date_db['occasions']
    # Convert the occasion_id to string
    occasion_id = str(occasion_id)
    current_occasions.append(occasion_id)
    # Update the day
    try:
        # client.db.days.update_one(date_db, {'$set': {'occasions': current_occasions}})
        client.db.days.update_one({'_id': ObjectId(data_db_id)}, {'$set': {'occasions': current_occasions}})
    except Exception as e:
        return {
            'status': 'fail to update',
            'error': str(e)
        }, 400
    return {
        'status': 'success',
        'occasion_name': occasion['name']
    }, 200


@app.route('/api/getOccationByDate', methods=['POST'])
def getOccasionByDate():
    body = request.get_json()
    userid = body['userid']
    date = body['date']
    target = client.db.calendar.find_one({'user': userid})
    date_db = find_day_by_date(client, target, date)
    occ_lst = []
    for occasion in date_db['occasions']:
        occasion_example = client.db.occasions.find_one({'_id': ObjectId(occasion)})
        occ_lst.append(occasion_example['name'])
    if occ_lst:
        return {
            'status': 'success',
            'response': occ_lst
               }, 200
    else:
        return {
            'status': 'occasions are not found',
        }, 404


@app.route('/api/ScanNewItem', methods=['POST'])
def detect_item():
    body = request.get_data()
    # userid = body['userid']
    # img = body['img']
    img = body
    # img = bytes(img, 'utf-8')
    # Detect Item
    item_name = detect(img)
    if item_name == "Nothing detected":
        return {
            'status': 'No Item Found',
        }, 400
    else:
        return {
            'status': 'success',
            'item': item_name
        }, 200


@app.route('/api/GetOutfit/<userid>', methods=['GET'])
def getOutfit(userid):
    target = client.db.user.find_one({'user': ObjectId(userid)})
    if target:
        if target['outfits']:
            outfits = target['outfits']
            return {
                'status': 'success',
                'outfits': outfits
            }, 200
        else:
            return {
                'status': 'no outfits found',
            }, 404
    else:
        return {
            'status': 'user not found',
        }, 404






# @app.route('/api/updateOutfit/<userid>', methods=['POST'])
# def createOutfit(userid):
#     target = client.db.Outfit.find_one({'owner': userid})
#     if target:
#         outfits = target['outfits']
#         # Find the days that have the same date
#         new_outfit = {
#             'creator': ObjectId(userid),
#             'created_time': datetime.now(),
#         }
#         outfits.append(new_outfit)
#         client.db.Outfit.update_one(target, {'$set': {'outfits': outfits}})

# @app.route('/api/getOutfitsByOccation/<userid>', methods=['Get'])
# def getOccasionByDate(userid, occation):
#     target = client.db.OutfitCollection.find_one({'user': userid})
#     if target:
#         outfits = target['outfits']
#         # Find the days that have the same date
#         result = []
#         for outfit in outfits:
#             if outfit['occation'] == occation:
#                 result.append(outfit)
#         return {
#                 'status': 'success',
#                 'response': result
#                }, 200
#     return {
#                'status': 'user not found',
#            }, 500

# @app.route('/api/signUp', methods=['POST'])
# def signUp(email, password, name):
#     target = client.db.User.find_one({'email': email})
#     if target:
#         return {
#                    'status': 'email already exists',
#                }, 400
#     newUser = {'email': email, 'password': password, 'name': name}
#     client.db.User.insert_one(newUser)

# @app.route('/api/login', methods=['GET'])
# def logIn(email, password):
#     target = client.db.User.find_one({'email': email})
#     if not target:
#         return {
#                    'status': 'user with provided email does not exist',
#                }, 400
#     if target['password'] == password:
#         return {
#                 'response': target,
#                 'status': 'success',
#                }, 200
#     else:
#         return {
#                    'status': 'password is incorrect',
#                }, 400

# @app.route('/api/updateWardrobe/<userid>', methods=['POST'])
# def createItem(userid):
#     target = client.db.Wardrobe.find_one({'user': userid})
#     if target:
#         items = target['items']
#         newItem = {
#             'creator': ObjectId(userid),
#             'created_time': datetime.now(),
#         }
#         items.append(newItem)
#         client.db.Outfit.update_one(target, {'$set': {'items': newItem}})

# @app.route('/api/getItemByType/<userid>', methods=['GET'])
# def getItemByType(userid, type):
#     target = client.db.Wardrobe.find_one({'user': userid})
#     if target:
#         items = target['items']
#         result = []
#         for item in items:
#             if item['type'] == type:
#                 result.append(item)
#         return {
#                    'status': 'success',
#                    'response': result
#                }, 200
#     return {
#                'status': 'user not found',
#            }, 500




