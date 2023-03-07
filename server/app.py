from datetime import datetime

from bson import ObjectId
import flask_pymongo
from flask import *
from flask_cors import CORS
from flask_pymongo import PyMongo
import sentry_sdk
from sentry_sdk.integrations.flask import FlaskIntegration
from dotenv import load_dotenv

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

@app.route('/api/test/<name>', methods=['POST'])
def test(name):
    target = client.sample_mflix.comments.find_one({'name': name})
    return target['text']


# Update Calendar
@app.route('/api/updateCalendar/<userid>', methods=['POST'])
def createOccasion(userid, date, occasion):
    target = client.db.Calendar.find_one({'user': userid})
    if target:
        days = target['days']
        # Find the days that have the same date
        for day in days:
            if day['date'] == date:
                new_occasion = {
                    'user': ObjectId(userid),
                    'name': occasion,
                    'date': date
                }
                day['occasions'].append(new_occasion)
        client.db.Calendar.update_one(target, {'$set': {'days': days}})

@app.route('/api/getOccationByDate/<userid>', methods=['Get'])
def getOccasionByDate(userid, date):
    target = client.db.Outfit.find_one({'user': userid})
    if target:
        days = target['days']
        # Find the days that have the same date
        for day in days:
            if day['date'] == date:
                return {
                    'status': 'success',
                    'response': days
                       }, 200
        return {
                'status': 'date is not found',
               }, 404
    return {
               'status': 'user not found',
           }, 500


@app.route('/api/updateOutfit/<userid>', methods=['POST'])
def createOutfit(userid):
    target = client.db.Outfit.find_one({'owner': userid})
    if target:
        outfits = target['outfits']
        # Find the days that have the same date
        new_outfit = {
            'creator': ObjectId(userid),
            'created_time': datetime.now(),
        }
        outfits.append(new_outfit)
        client.db.Outfit.update_one(target, {'$set': {'outfits': outfits}})

@app.route('/api/getOutfitsByOccation/<userid>', methods=['Get'])
def getOccasionByDate(userid, occation):
    target = client.db.OutfitCollection.find_one({'user': userid})
    if target:
        outfits = target['outfits']
        # Find the days that have the same date
        result = []
        for outfit in outfits:
            if outfit['occation'] == occation:
                result.append(outfit)
        return {
                'status': 'success',
                'response': result
               }, 200
    return {
               'status': 'user not found',
           }, 500

@app.route('/api/signUp', methods=['POST'])
def signUp(email, password, name):
    target = client.db.User.find_one({'email': email})
    if target:
        return {
                   'status': 'email already exists',
               }, 400
    newUser = {'email': email, 'password': password, 'name': name}
    client.db.User.insert_one(newUser)

@app.route('/api/login', methods=['GET'])
def logIn(email, password):
    target = client.db.User.find_one({'email': email})
    if not target:
        return {
                   'status': 'user with provided email does not exist',
               }, 400
    if target['password'] == password:
        return {
                'response': target,
                'status': 'success',
               }, 200
    else:
        return {
                   'status': 'password is incorrect',
               }, 400

@app.route('/api/updateWardrobe/<userid>', methods=['POST'])
def createItem(userid):
    target = client.db.Wardrobe.find_one({'user': userid})
    if target:
        items = target['items']
        newItem = {
            'creator': ObjectId(userid),
            'created_time': datetime.now(),
        }
        items.append(newItem)
        client.db.Outfit.update_one(target, {'$set': {'items': newItem}})

@app.route('/api/getItemByType/<userid>', methods=['GET'])
def getItemByType(userid, type):
    target = client.db.Wardrobe.find_one({'user': userid})
    if target:
        items = target['items']
        result = []
        for item in items:
            if item['type'] == type:
                result.append(item)
        return {
                   'status': 'success',
                   'response': result
               }, 200
    return {
               'status': 'user not found',
           }, 500




