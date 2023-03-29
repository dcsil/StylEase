from datetime import datetime

from bson import ObjectId
import flask_pymongo
from flask import *
from flask_cors import CORS
from flask_pymongo import PyMongo
import sentry_sdk
from sentry_sdk.integrations.flask import FlaskIntegration
from dotenv import load_dotenv
from AI.detection import detect
from tool_box.finder import *
import os
import base64
import io
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
@app.route('/api/GetUser/<userid>', methods=['GET'])
def get_user(userid):
    target = find_by_id(client, 'users', userid)
    if isinstance(target, tuple):
        return target
    target['_id'] = str(target['_id'])
    return {
               'status': 'success',
               'user': target
           }, 200



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
    # Check if is tuple
    if isinstance(date_db, tuple):
        return date_db
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


# Clothing methods
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


@app.route('/api/AddNewItem', methods=['POST'])
def addNewItem():
    body = request.get_json()
    userid = body['userid']
    item = body['item']
    # Add new item to db.items
    item_id = client.db.items.insert_one(item).inserted_id
    # Add the item to the user's WARDROBE
    target = find_by_id(client, 'users', userid)
    if isinstance(target, tuple):
        return target
    if target['wardrobe']:
        wardrobe_id = target['wardrobe']
        wardrobe = find_by_id(client, 'wardrobes', wardrobe_id)
        if isinstance(wardrobe, tuple):
            return wardrobe
        current_items = wardrobe['items']
        current_items.append(item_id)
        try:
            client.db.wardrobes.update_one({'_id': ObjectId(wardrobe_id)}, {'$set': {'items': current_items}})
        except Exception as e:
            return {
                'status': 'fail to update',
                'error': str(e)
            }, 400
        return {
            'status': 'success'
        }, 200
    else:
        return {
            'status': 'user has no wardrobe',
        }, 404


@app.route('/api/GetItemImage/<itemid>', methods=['GET'])
def getItemimg(itemid):
    item = find_by_id(client, 'items', itemid)
    if isinstance(item, tuple):
        return item
    # Image is in base64 format
    img = item['img']
    # Use io.BytesIO to convert the base64 string to bytes
    img = io.BytesIO(base64.b64decode(img))
    # Send the image to the user
    return send_file(img, mimetype='image/jpeg')


@app.route('/api/GetWardrobeItems/<userid>', methods=['GET'])
def getWardrobeItems(userid):
    target = find_by_id(client, 'users', userid)
    if isinstance(target, tuple):
        return target
    if target['wardrobe']:
        wardrobe_id = target['wardrobe']
        wardrobe = find_by_id(client, 'wardrobes', wardrobe_id)
        if isinstance(wardrobe, tuple):
            return wardrobe
        items = wardrobe['items']
        items_lst = []
        for item in items:
            item = find_by_id(client, 'items', item)
            if isinstance(item, tuple):
                return item
            item.pop('image')
            item['_id'] = str(item['_id'])
            items_lst.append(item)
        wardrobe['items'] = items_lst
        wardrobe['_id'] = str(wardrobe['_id'])

        return {
            'status': 'success',
            'wardrobe': wardrobe
        }, 200
    else:
        return {
            'status': 'user has no wardrobe',
        }, 404

    # {
    #     'user': '64237961038602a02a81cd92',
    #      '_id': '6423797a038602a02a81cd94',
    #     'created_time': '2023-03-15',
    #     'items': [{'_id': '64237aef7bd7fa3c355dda94',
    #                'brand': 'Alyx',
    #                'color': 'White',
    #                'created_time': '2023-03-15',
    #                'name': 'White Trouser',
    #                'type': 'Trouser',
    #                'user': '64237961038602a02a81cd92'},
    #               {'_id': '64237df5ad0c1edddca0f8dc',
    #                'brand': 'Amiri',
    #                'color': 'Blue',
    #                'created_time':
    #                    '2023-03-15',
    #                'name': 'Blue Coat',
    #                'type': 'Coat',
    #                'user': '64237961038602a02a81cd92'}]
    # }


# Present formated outfits to the user
@app.route('/api/GetOutfit', methods=['POST'])
def getOutfit(userid):
    body = request.get_json()
    userid = body['userid']
    outfit_id = body['outfit_id']
    target = client.db.users.find_one({'user': ObjectId(userid)})
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




