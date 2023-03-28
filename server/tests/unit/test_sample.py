import pytest
from datetime import datetime
from bson.objectid import ObjectId

import os
import tempfile
import pytest
import sys
sys.path.append('..')
from server.app import app
import base64

# Test the /api/test endpoint
def test_test_endpoint():
    with app.test_client() as client:
        response = client.get('/api/test/Ellaria Sand')
        assert response.status_code == 200
        assert response.data.decode('utf-8') == 'Voluptatum harum nobis recusandae exercitationem modi deserunt voluptates. Deleniti velit perferendis vitae quas excepturi quos esse deserunt.'

# Test Calendar methods
# Test the /api/createOccasion endpoint
def test_create_occasion_endpoint():
    with app.test_client() as client:
        response = client.post('/api/createOccasion', json={
            'userid': '61ed3b23749b5426fbbdd6ad',
            'date': '2023-03-15',
            'occasion': {'name': 'Test Occasion', 'date': '2023-03-15', 'planned_outfits': [], 'place': 'Home'}
        })
        assert response.status_code == 200
        assert response.data.decode('utf-8') == '{"occasion_name":"Test Occasion","status":"success"}\n'

# Test the /api/getOccationByDate endpoint
def test_get_occation_by_date_endpoint():
    with app.test_client() as client:
        response = client.post('/api/getOccationByDate', json={
            'userid': '61ed3b23749b5426fbbdd6ad',
            'date': '2023-03-15'
        })
        assert response.status_code == 200
        assert response.data.decode('utf-8') == '{"response":["Birthday Party 1","Birthday Party 2"],"status":"success"}\n'

# Test scan item
def test_scan_new_item_endpoint():
    print(os.path)
    with open("tests/unit/test.png", "rb") as img_file:
        my_string = base64.b64encode(img_file.read())
        # my_string = str(my_string)
    with app.test_client() as client:
        response = client.post('/api/ScanNewItem', data=my_string)
        assert response.status_code == 200
        assert response.data.decode('utf-8') == '{"item":"Shirt","status":"success"}\n'
