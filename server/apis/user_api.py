from datetime import datetime
from flask import *
import os
from passlib.hash import sha256_crypt
from flask import Blueprint
from apis.finder import *
# from server.app import client
from database import client
from bson import ObjectId


user_api = Blueprint('user_api', __name__)
# cors = CORS(user_api)
# # configuration
# user_api.config['MONGO_URI'] = os.environ.get("MONGODB_URL")
# Connect to MongoDB, where client is the MongoClient object
# client = flask_pymongo.MongoClient(os.environ.get("MONGODB_URL"))
# client = pymongo.MongoClient(os.environ.get("MONGODB_URL"), tlsCAFile=certifi.where())


# Login
@user_api.route('/api/Login', methods=['POST'])
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
@user_api.route('/api/Register', methods=['POST'])
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
    try:
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

        # Create a calendar for the user
        calendar = {
          "user": str(userid),
          "created_time": datetime.now(),
          "days": []
        }

        # Create a wardrobe for the user
        wardrobe = {
            "user": str(userid),
            "created_time": datetime.now(),
            "items": []
            }

        # Insert the calendar and wardrobe to db.calendars and db.wardrobes
        cal_id = client.db.calendars.insert_one(calendar).inserted_id
        war_id = client.db.wardrobes.insert_one(wardrobe).inserted_id

        # Update the calendar and wardrobe id in db.users
        client.db.users.update_one({'_id': ObjectId(userid)}, {'$set': {'calendar': str(cal_id)}})
        client.db.wardrobes.update_one({'_id': ObjectId(userid)}, {'$set': {'wardrobe': str(war_id)}})
    except Exception as e:
        return {
            'status': 'fail',
            'error': str(e)
        }, 400

    return {
        'status': 'success',
        'userid': str(userid)
    }, 200


# GET carries request parameter appended in URL string while POST carries request parameter in message body
@user_api.route('/api/GetUser/<userid>', methods=['GET'])
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