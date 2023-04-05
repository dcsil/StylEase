from datetime import datetime
import pymongo
import certifi
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
from passlib.hash import sha256_crypt
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
client = pymongo.MongoClient(os.environ.get("MONGODB_URL"), tlsCAFile=certifi.where())
# mongo = PyMongo(app)

@app.route('/api/test/<name>', methods=['GET'])
def test(name):
    target = client.sample_mflix.comments.find_one({'name': name})
    return target['text']

# Login
@app.route('/api/Login', methods=['POST'])
def login():
    body = request.get_json()
    email = body['email']
    password = body['password']
    # Compare to the password that encrypted in the database
    target = client.db.users.find_one({'email': email})
    if isinstance(target, tuple):
        return target
    if sha256_crypt.verify(password, target['password']):
        return {
            'status': 'success',
            'userid': str(target['_id'])
        }, 200
    else:
        return {
            'status': 'fail',
            'error': 'Wrong password'
        }, 400


# Register
@app.route('/api/Register', methods=['POST'])
def register():
    body = request.get_json()
    name = body['name']
    email = body['email']
    password = body['password']
    # Check if the user already exists
    target = client.db.users.find_one({'email': email})
    if target:
        return {
            'status': 'fail',
            'error': 'Email already exists'
        }, 400

    # Encrypt the password
    password = sha256_crypt.encrypt(password)
    # Insert the user to db.users
    userid = client.db.users.insert_one({
        'name': name,
        'email': email,
        'password': password,
        'calendar': '',
        'wardrobe': '',
        'outfits': [],
        'outfit_collections': []
    }).inserted_id

    return {
        'status': 'success',
        'userid': str(userid)
    }, 200

# GET carries request parameter appended in URL string while POST carries request parameter in message body
@app.route('/api/GetUser/<userid>', methods=['GET'])
def get_user(userid):
    target = find_by_id(client, 'users', userid)
    if isinstance(target, tuple):
        return target
    target['_id'] = str(target['_id'])
    target.pop('password')
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
    body = request.get_json()
    # userid = body['userid']
    # In the format of "data:image/png;base64,iVBORw...."
    img = body['image']
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
    # Add type of the item
    item['type'] = detect(item['image'])
    # item['type'] = "Suit"

    # Add new item to db.items
    item_id = client.db.items.insert_one(item).inserted_id
    # Add the item to the user's WARDROBE if userid is given
    if userid != '' and not item['market']:
        target = find_by_id(client, 'users', userid)
        if isinstance(target, tuple):
            return target
        if target['wardrobe']:
            wardrobe_id = target['wardrobe']
            wardrobe = find_by_id(client, 'wardrobes', wardrobe_id)
            if isinstance(wardrobe, tuple):
                return wardrobe
            current_items = wardrobe['items']
            item_id = str(item_id)
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
    else:
        return {
            'status': 'success'
        }, 200


@app.route('/api/AddNewOutfit', methods=['POST'])
def addNewOutfit():
    body = request.get_json()
    outfit = body['outfit']
    outfit_collection = body['outfit_collection']
    # Add new outfit to db.outfits
    outfit_id = client.db.outfits.insert_one(outfit).inserted_id
    # Add the outfit to the user's WARDROBE
    target = find_by_id(client, 'users', outfit['creator'])
    if isinstance(target, tuple):
        return target
    outfits_lst = target['outfits']
    outfit_id = str(outfit_id)
    outfits_lst.append(outfit_id)
    try:
        client.db.users.update_one({'_id': ObjectId(outfit['creator'])}, {'$set': {'outfits': outfits_lst}})
    except Exception as e:
        return {
            'status': 'fail to update',
            'error': str(e)
        }, 400
    # Add the outfit to the user's outfit collection
    if outfit_collection != '':
        added = False
        for collection in target["outfit_collections"]:
            collection_target = find_by_id(client, 'outfitcollections', collection)
            if isinstance(collection_target, tuple):
                return collection_target
            if collection_target['name'] == outfit_collection:
                collection_target['outfits'].append(outfit_id)
                try:
                    client.db.outfitcollections.update_one({'_id': ObjectId(collection)}, {'$set': {'outfits': collection_target['outfits']}})
                except Exception as e:
                    return {
                        'status': 'fail to update',
                        'error': str(e)
                    }, 400
                added = True
                break
        if not added:
            return {
                'status': 'outfit collection not found',
            }, 404
    return {
        'status': 'success'
    }, 200


@app.route('/api/AddNewCollection', methods=['POST'])
def addNewCollection():
    body = request.get_json()
    userid = body['userid']
    collection = body['outfit_collection']
    # Add new collection to db.outfitcollections
    collection_id = client.db.outfitcollections.insert_one(collection).inserted_id
    # Add the collection to the user's WARDROBE
    target = find_by_id(client, 'users', userid)
    if isinstance(target, tuple):
        return target
    collections_lst = target['outfit_collections']
    collection_id = str(collection_id)
    collections_lst.append(collection_id)
    try:
        client.db.users.update_one({'_id': ObjectId(userid)}, {'$set': {'outfit_collections': collections_lst}})
    except Exception as e:
        return {
            'status': 'fail to update',
            'error': str(e)
        }, 400
    return {
        'status': 'success'
    }, 200

@app.route('/api/GetItemImage/<itemid>', methods=['GET'])
def getItemimg(itemid):
    item = find_by_id(client, 'items', itemid)
    if isinstance(item, tuple):
        return item
    # Image is in base64 format
    img = item['image']
    img_string = img.split(',')[1]

    # Decode the base64 string to binary and Use io.BytesIO to convert the binary to bytes
    img = io.BytesIO(base64.b64decode(img_string))
    # Send the image to the user
    response = make_response(img)
    response.headers.set('Content-Type', 'image/jpeg')
    # response.headers.set('Content-Length', len(img_string))

    return response, 200

    # return send_file(img, mimetype='image/jpeg')


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
        # items_lst = []
        # for item in items:
        #     item = find_by_id(client, 'items', item)
        #     if isinstance(item, tuple):
        #         return item
        #     item.pop('image')
        #     item['_id'] = str(item['_id'])
        #     items_lst.append(item)
        items_lst = get_items(client, items)
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

@app.route('/api/Getoutfitcollection/<userid>', methods=['GET'])
def getOutfitCollection(userid):
    target = find_by_id(client, 'users', userid)
    if isinstance(target, tuple):
        return target
    if target['outfit_collections']:
        outfit_collections_id_lst = target['outfit_collections']
        outfit_collections_lst = []
        for outfits_collection_id in outfit_collections_id_lst:
            outfits_collection = find_by_id(client, 'outfitcollections', outfits_collection_id)
            if isinstance(outfits_collection, tuple):
                return outfits_collection
            outfits_lst = []
            for outfit in outfits_collection['outfits']:
                outfit = find_by_id(client, 'outfits', outfit)
                if isinstance(outfit, tuple):
                    return outfit
                outfit['_id'] = str(outfit['_id'])
                items = outfit['items']
                items_lst = get_items(client, items)
                outfit['items'] = items_lst
                outfits_lst.append(outfit)
            outfits_collection['outfits'] = outfits_lst
            outfits_collection['_id'] = str(target['_id'])
            outfit_collections_lst.append(outfits_collection)

        return {
            'status': 'success',
            'outfit_collections': outfit_collections_lst
        }, 200
    else:
        return {
            'status': 'user has no outfit collection',
        }, 404


# Present formated outfits to the user
@app.route('/api/GetOutfit/<userid>/<outfitid>', methods=['GET'])
def getOutfit(userid, outfitid):
    target = find_by_id(client, 'users', userid)
    if isinstance(target, tuple):
        return target
    if target['outfits']:
        outfits_id_lst = target['outfits']
        if outfitid in outfits_id_lst:
            outfit = find_by_id(client, 'outfits', outfitid)
            if isinstance(outfit, tuple):
                return outfit
            outfit['_id'] = str(outfit['_id'])
            items = outfit['items']
            items_lst = get_items(client, items)
            outfit['items'] = items_lst
            return {
                'status': 'success',
                'outfit': outfit
            }, 200
        else:
            return {
                'status': 'outfit not found',
            }, 404
    else:
        return {
            'status': 'user has no outfit',
        }, 404

# Create AI outfit
@app.route('/api/CreateAIOutfit', methods=['POST'])
def createAIOutfit():
    data = request.get_json()
    outfit = data['outfit']
    # Hard Code
    # get item 64237ecfa77fdcf57203ff96
    if data['regenerate']:
        # Suggest items 642c9b687032063a2f2f1e78, 642c9a701f8bd8fef92cbf18,
        # 642c9a27756f6d8ab3562456, 642c99a94146ee0f23e68bf6
        # ai_outfit = {'items': [
        #     {'itemid': '64237ecfa77fdcf57203ff96', 'market': False},
        #     {'itemid': '642c9b687032063a2f2f1e78', 'market': True},
        #     {'itemid': '642c9a701f8bd8fef92cbf18', 'market': True},
        #     {'itemid': '642c9a27756f6d8ab3562456', 'market': True},
        #     {'itemid': '642c99a94146ee0f23e68bf6', 'market': True}
        # ]}
        items = [
            {'itemid': '64237ecfa77fdcf57203ff96', 'user': '64237961038602a02a81cd92'},
            {'itemid': '642c9b687032063a2f2f1e78', 'user': ''},
            {'itemid': '642c9a701f8bd8fef92cbf18', 'user': ''},
            {'itemid': '642c9a27756f6d8ab3562456', 'user': ''},
            {'itemid': '642c99a94146ee0f23e68bf6', 'user': ''}
        ]
    else:
        # ai_outfit = {'items': [
        #     {'itemid': '64237ecfa77fdcf57203ff96', 'market': False},
        #     {'itemid': '64237df5ad0c1edddca0f8dc', 'market': False},
        #     {'itemid': '642c96dcbaac041ea8a98a01', 'market': True},
        #     {'itemid': '642c9a4d917524429c1bf982', 'market': True},
        #     {'itemid': '642c9b687032063a2f2f1e78', 'market': True}
        # ]}
        items = [
            {'itemid': '64237ecfa77fdcf57203ff96', 'user': '64237961038602a02a81cd92'},
            {'itemid': '64237df5ad0c1edddca0f8dc', 'user': '64237961038602a02a81cd92'},
            {'itemid': '642c96dcbaac041ea8a98a01', 'user': ''},
            {'itemid': '642c9a4d917524429c1bf982', 'user': ''},
            {'itemid': '642c9b687032063a2f2f1e78', 'user': ''}
        ]

    outfit['items'] = items

    return {
        'status': 'success',
        'ai_outfit': outfit
    }, 200
