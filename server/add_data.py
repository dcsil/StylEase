import os
import tempfile
import pytest
import sys
sys.path.append('..')
from server.app import app
import base64

if __name__ == "__main__":
    with open("test_image/jacket.png", "rb") as img_file:
        my_string = base64.b64encode(img_file.read()).decode('utf-8')
        my_string = 'data:image/png;base64,{}'.format(my_string)

    # with open("test_image/hoodie.png", "rb") as img_file:
    #     my_string = base64.b64encode(img_file.read())
    # with open("test_image/pants.png", "rb") as img_file:
    #     my_string = base64.b64encode(img_file.read())
    # with open("test_image/shoes.png", "rb") as img_file:
    #     my_string = base64.b64encode(img_file.read())

        # my_string = str(my_string)
    image = {
        'image': my_string
    }
    with app.test_client() as client:
        response = client.post('/api/ScanNewItem', json=image)
        print(response.data.decode('utf-8'))
    #
    item = {
        "name": "Blue Sneaker",
        "user": "64237961038602a02a81cd92",
        "image": str(my_string),
        "created_time": "2023-03-15",
        "type": "Sneaker",
        "color": "Blue",
        "brand": "Amiri"
    }
    # #
    # body = {
    #     'userid': "64237961038602a02a81cd92",
    #     'item': item
    # }
    #
    # with app.test_client() as client:
    #     response = client.post('/api/AddNewItem', json=body)
    #     print(response.data.decode('utf-8'))

    # with app.test_client() as client:
    #     response = client.get('/api/GetWardrobeItems/64237961038602a02a81cd92')
    #     print(response.data.decode('utf-8'))

    # with app.test_client() as client:
    #     response = client.get('/api/GetUser/64237961038602a02a81cd92')
    #     print(response.data.decode('utf-8'))

    # with app.test_client() as client:
    #     response = client.get('/api/GetItemImage/64237aef7bd7fa3c355dda94')
    #     print(response)