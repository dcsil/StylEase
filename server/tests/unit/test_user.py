from flask import *
from flask_cors import CORS
from dotenv import load_dotenv
import base64
import os
import sys
sys.path.append('..')

# from server.app import app
from server.apis.user_api import user_api
from server.database import client as cl
from server.apis.finder import *

# initialize app
load_dotenv()
app = Flask(__name__)

cors = CORS(app)
# configuration
app.config['MONGO_URI'] = os.environ.get("MONGODB_URL")
# Register the clothing_api blueprint
app.register_blueprint(user_api)

# Test get user
def test_get_user_endpoint():
    with app.test_client() as client:
        response = client.get('/api/GetUser/6435f5a3ea5f65cdf025881d')
        assert response.status_code == 200
        assert response.json['user']['email'] == "testing"
        assert len(response.json['user']['outfit_collections']) > 0
        assert len(response.json['user']['outfits']) > 0
        assert response.json['user']['wardrobe'] is not None

# Test register
def test_register_login_endpoint():
    body = {
        'name': 'temp',
        'email': 'temp',
        'password': 'temp'
    }

    with app.test_client() as client:
        response = client.post('/api/Register', json=body)
        assert response.status_code == 200
        assert response.json['status'] == "success"
        userid = response.json['userid']

    login_body = {
        'email': 'temp',
        'password': 'temp'
    }

    with app.test_client() as client:
        response = client.post('/api/Login', json=login_body)
        assert response.status_code == 200
        assert response.json['status'] == "success"
        assert response.json['userid'] == userid

    # Test wrong password
    login_body = {
        'email': 'temp',
        'password': 'wrong'
    }

    with app.test_client() as client:
        response = client.post('/api/Login', json=login_body)
        assert response.status_code == 400
        assert response.json['status'] == "fail"
        assert response.json['error'] == "Wrong password"

    # Delete temp user
    target = find_by_id(cl, 'users', userid)
    if target:
        wardrobe_id = target['wardrobe']
        outfit_collection_id = target['outfit_collections'][0]
        calendar_id = target['calendar']
        cl.db.users.delete_one({'_id': ObjectId(userid)})
        cl.db.wardrobes.delete_one({'_id': ObjectId(wardrobe_id)})
        cl.db.outfitcollections.delete_one({'_id': ObjectId(outfit_collection_id)})
        cl.db.calendar.delete_one({'_id': ObjectId(calendar_id)})

    # Test fail login
    login_body = {
        'email': 'temp',
        'password': 'temp'
    }

    with app.test_client() as client:
        response = client.post('/api/Login', json=login_body)
        assert response.status_code == 400
        assert response.json['status'] == "fail"
        assert response.json['error'] == "Email does not exist"

# Test finder
def test_get_item():
    items = get_items(cl, ['6435f753de08bc1aa531d3b1'])
    assert len(items) == 1
