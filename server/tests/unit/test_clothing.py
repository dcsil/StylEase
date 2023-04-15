from flask import *
from flask_cors import CORS
from dotenv import load_dotenv
import base64
import os
import sys
sys.path.append('..')

from apis.clothing_api import clothing_api

# initialize app
load_dotenv()
app = Flask(__name__)

cors = CORS(app)
# configuration
app.config['MONGO_URI'] = os.environ.get("MONGODB_URL")
# Register the clothing_api blueprint
app.register_blueprint(clothing_api)

# Test scan item
# def test_scan_new_item_endpoint():
#     with open("tests/unit/test.png", "rb") as img_file:
#         my_string = base64.b64encode(img_file.read()).decode('utf-8')
#         my_string = 'data:image/png;base64,{}'.format(my_string)
#
#     image = {
#         'image': my_string
#     }
#     with app.test_client() as client:
#         response = client.post('/api/ScanNewItem', json=image)
#         print(response.data.decode('utf-8'))
#         assert response.status_code == 200
#         assert response.data.decode('utf-8') == '{"item":"Shirt","status":"success"}\n'


# Test add and del new item
def test_add_del_new_item_endpoint():
    # with open("tests/unit/shoes.png", "rb") as img_file:
    # with open("./shoes.png", "rb") as img_file:
    #     my_string = base64.b64encode(img_file.read()).decode('utf-8')
    #     my_string = 'data:image/png;base64,{}'.format(my_string)

    item = {
        "name": "Sneaker",
        "user": "6435f5a3ea5f65cdf025881d",
        "image": "test img string in base64",
        "created_time": "2023-04-01",
        "type": "Sneaker",
        "color": "White",
        "brand": "Amiri",
        "market": False
    }
    #
    body = {
        'userid': "6435f5a3ea5f65cdf025881d",
        'item': item
    }

    with app.test_client() as client:
        response = client.post('/api/AddNewItem', json=body)
        # print(response.data.decode('utf-8'))
        item_id = response.json['item_id']
        assert response.status_code == 200

    body = {
        'userid': "6435f5a3ea5f65cdf025881d",
        'itemid': item_id
    }

    with app.test_client() as client:
        response = client.post('/api/DeleteItem', json=body)
        assert response.status_code == 200
        assert response.json['item_id'] == item_id

    body = {
        'userid': "6435f5a3ea5f65cdf025881d",
        'itemid': '64237aef7bd7fa3c355dda94'
    }

    with app.test_client() as client:
        response = client.post('/api/DeleteItem', json=body)
        assert response.status_code == 400
        assert response.json['error'] == "user not match"

    body = {
        'userid': "6435f5a3ea5f65cdf025881d",
        'itemid': '64237aef7bd7fa3c355dda11'
    }

    with app.test_client() as client:
        response = client.post('/api/DeleteItem', json=body)
        assert response.status_code == 404
        assert response.json['error'] == "items not found"


# Test add and del new outfit
def test_add_del_new_outfit_endpoint():
    outfit = {
        "creator": "6435f5a3ea5f65cdf025881d",
        "created_time": "2023-04-01",
        "occasion": "Bro's birthday party",
        "style": "Casual",
        "items": ["6435f753de08bc1aa531d3b1",
                  "6435f7a199def560bc4e51d0",
                  "6435f7cb053aa5049e92c83e",
                  "6435f7e23161988ce7efa68b"],
         "budget": 5000,
         "is_AI": False
     }
    body = {
        'outfit': outfit,
        'outfit_collection': "Default"
    }

    with app.test_client() as client:
        response = client.post('/api/AddNewOutfit', json=body)
        outfit_id = response.json['outfit_id']
        assert response.status_code == 200
        assert response.data.decode('utf-8') == f'{{"outfit_id":"{outfit_id}","status":"success"}}\n'

    body = {
        'outfit_id': outfit_id,
        'user_id': '6435f5a3ea5f65cdf025881d'
    }

    with app.test_client() as client:
        response = client.post('/api/DeleteOutfit', json=body)
        assert response.status_code == 200
        assert response.data.decode('utf-8') == f'{{"outfit_id":"{outfit_id}","status":"success"}}\n'

# Test add and del new outfit collection
def test_add_del_new_outfit_collection_endpoint():
    outfitcollection = {
            'name': 'Default',
            "owner": '6435f5a3ea5f65cdf025881d',
            "created_time": '2023-04-01',
            "outfits": []
        }
    body = {
        'outfit_collection': outfitcollection,
        'userid': '6435f5a3ea5f65cdf025881d'
    }

    with app.test_client() as client:
        response = client.post('/api/AddNewCollection', json=body)
        collect_id = response.json['collection_id']
        assert response.status_code == 200
        assert response.data.decode('utf-8') == f'{{"collection_id":"{collect_id}","status":"success"}}\n'

    body = {
        'collection_id': collect_id,
        'userid': '6435f5a3ea5f65cdf025881d'
    }

    with app.test_client() as client:
        response = client.post('/api/DeleteCollection', json=body)
        assert response.status_code == 200
        assert response.data.decode('utf-8') == f'{{"collection_id":"{collect_id}","status":"success"}}\n'

# Test get wardrobe
def test_get_wardrobe_endpoint():
    with app.test_client() as client:
        response = client.get('/api/GetWardrobeItems/6435f5a3ea5f65cdf025881d')
        assert response.status_code == 200
        assert response.json['status'] == 'success'
        type_lst = []
        for item in response.json['wardrobe']['items']:
            type_lst.append(item['type'])
        assert 'Pullover' in type_lst
        assert 'Coat' in type_lst
        assert 'Trouser' in type_lst
        assert 'Sneaker' in type_lst

# Test get outfit collection
def test_get_outfit_collection_endpoint():
    with app.test_client() as client:
        response = client.get('/api/Getoutfitcollection/6435f5a3ea5f65cdf025881d')
        assert response.status_code == 200
        assert response.json['status'] == 'success'
        assert response.json['outfit_collections'][0]['name'] == 'Default'
        assert response.json['outfit_collections'][0]['outfits'][0]['occasion'] == "Bro's birthday party"

        response = client.get('/api/Getoutfitcollection/6435f5a3ea11111111111111')
        assert response.status_code == 404
        assert response.json['error'] == 'users not found'


def test_get_outfit_endpoint():
    with app.test_client() as client:
        response = client.get('/api/GetOutfit/6435f5a3ea5f65cdf025881d/6435f8e40b57cf80541c8037')
        assert response.status_code == 200
        assert response.json['status'] == 'success'
        assert response.json['outfit']['occasion'] == "Bro's birthday party"
        assert response.json['outfit']['style'] == "Casual"
        assert response.json['outfit']['budget'] == 5000
        assert response.json['outfit']['is_AI'] is False

