import pytest
from datetime import datetime
from bson.objectid import ObjectId

import os
import tempfile
import pytest
import sys
sys.path.append('..')
from server.app import app

# Test the /api/test endpoint
def test_test_endpoint():
    with app.test_client() as client:
        response = client.post('/api/test/Ellaria Sand')
        assert response.status_code == 200
        assert response.data.decode('utf-8') == 'Voluptatum harum nobis recusandae exercitationem modi deserunt voluptates. Deleniti velit perferendis vitae quas excepturi quos esse deserunt.'

# Test the /api/getOccationByDate endpoint
# def test_get_occation_by_date_endpoint():
#     with app.test_client() as client:
#         response = client.get('/api/getOccationByDate', json={
#             'userid': '61ed3b23749b5426fbbdd6ad',
#             'date': '2023-03-15'
#         })
#         assert response.status_code == 200
#         assert response.data.decode('utf-8') == ['Birthday Party 1', 'Birthday Party 2']