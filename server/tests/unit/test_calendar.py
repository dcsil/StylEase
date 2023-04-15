from flask import *
from flask_cors import CORS
from dotenv import load_dotenv

import os
import sys
sys.path.append('..')

# from server.app import app
from apis.calendar_api import calendar_api

# initialize app
load_dotenv()
app = Flask(__name__)

cors = CORS(app)
# configuration
app.config['MONGO_URI'] = os.environ.get("MONGODB_URL")
# Register the calendar_api blueprint
app.register_blueprint(calendar_api)

# Test plan
def test_plan_endpoint():
    plan = {
      "user": "6435f5a3ea5f65cdf025881d",
      "name": "Meeting",
      "date": "2022-04-13",
      "createdTime": "2022-04-08",
      "planned_outfits": [
        "6435f8e40b57cf80541c8037"
      ],
      "occasion": ""
    }
    with app.test_client() as client:
        response = client.post('/api/AddPlanToDay', json=plan)
        assert response.status_code == 200
        assert response.json['status'] == "success"
        assert response.json['day_id'] is not None
        assert response.json['plan_id'] is not None
        # print(response.data.decode('utf-8'))
        day_id = response.json['day_id']
        plan_id = response.json['plan_id']

    with app.test_client() as client:
        response = client.get(f'/api/GetPlan/{plan_id}')
        # print(response.data.decode('utf-8'))
        assert response.status_code == 200
        assert response.json['plan']['name'] == "Meeting"
        assert response.json['plan']['date'] == "2022-04-13"
        assert len(response.json['plan']['planned_outfits']) > 0

    plan = {
      "user": "6435f5a3ea5f65cdf025881d",
      "name": "Meeting with Professor",
      "date": "2022-04-13",
      "createdTime": "2022-04-08",
      "planned_outfits": [],
      "occasion": ""
    }

    body = {
        'plan': plan,
        'plan_id': plan_id
    }

    with app.test_client() as client:
        response = client.post('/api/UpdatePlan', json=body)
        # print(response.data.decode('utf-8'))
        assert response.status_code == 200
        assert response.json['status'] == "success"
        assert response.json['plan_id'] == plan_id

    with app.test_client() as client:
        response = client.get(f'/api/GetPlan/{plan_id}')
        # print(response.data.decode('utf-8'))
        assert response.status_code == 200
        assert response.json['plan']['name'] == "Meeting with Professor"
        assert response.json['plan']['date'] == "2022-04-13"
        assert len(response.json['plan']['planned_outfits']) == 0

    # Delete
    body = {
        'day_id': day_id,
        'plan_id': plan_id
    }

    with app.test_client() as client:
        response = client.post('/api/DeletePlan', json=body)
        # print(response.data.decode('utf-8'))
        assert response.status_code == 200
        assert response.json['status'] == "success"
        assert response.json['plan_id'] == plan_id


# Test get all days
def test_get_all_days_endpoint():
    with app.test_client() as client:
        response = client.get('/api/GetAllDays/6435f5a3ea5f65cdf025881d')
        assert response.status_code == 200
        assert len(response.json['days']) > 0
        assert len(response.json['days'][0]['plans']) > 0