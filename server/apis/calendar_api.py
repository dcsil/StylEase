from flask import *
from flask import Blueprint
from apis.finder import *
from database import client
from bson import ObjectId

calendar_api = Blueprint('calendar_api', __name__)


@calendar_api.route('/api/GetAllDays/<userid>', methods=['GET'])
def getalldays(userid):
    target_user = find_by_id(client, 'users', userid)
    if isinstance(target_user, tuple):
        return target_user
    calendar_id = target_user['calendar']
    target_calendar = find_by_id(client, 'calendars', calendar_id)
    if isinstance(target_calendar, tuple):
        return target_calendar
    days = target_calendar['days']
    days_lst = []
    for day_id in days:
        day = find_by_id(client, 'days', day_id)
        if isinstance(day, tuple):
            return day
        day['_id'] = str(day['_id'])
        days_lst.append(day)
    return {
        'status': 'success',
        'days': days_lst
    }, 200


# Add a new plan to a day
@calendar_api.route('/api/AddPlanToDay', methods=['POST'])
def addplantoday():
    plan = request.get_json()
    # day_id = body['day_id']
    # plan = body['plan']
    # Insert the plan to db.plans
    plan_id = client.db.plans.insert_one(plan).inserted_id
    date = plan['date']
    creator = plan['user']
    # Find the user
    target_user = find_by_id(client, 'users', creator)
    # Find the calendar
    calendar_id = target_user['calendar']
    target_calendar = find_by_id(client, 'calendars', calendar_id)
    # Find whether the date is in the calandar days
    added = False
    dayid = None
    for day_id in target_calendar['days']:
        day = find_by_id(client, 'days', day_id)
        if isinstance(day, tuple):
            return day
        if day['date'] == date:
            plans = day['plans']
            plans.append(str(plan_id))
            # Update the day
            try:
                client.db.days.update_one({'_id': ObjectId(day_id)}, {'$set': {'plans': plans}})
                added = True
                dayid = day_id
            except Exception as e:
                return {
                           'status': 'fail to add plan to day',
                           'error': str(e)
                       }, 400

    # If the date is not in the calendar days, create a new day
    if not added:
        new_day = {
            'date': date,
            'plans': [str(plan_id)]
        }
        try:
            dayid = client.db.days.insert_one(new_day).inserted_id
            # Update the calendar
            days = target_calendar['days']
            days.append(str(dayid))
            client.db.calendars.update_one({'_id': ObjectId(calendar_id)}, {'$set': {'days': days}})
        except Exception as e:
            return {
                       'status': 'fail',
                       'error': str(e)
                   }, 400
    return {
                'status': 'success',
                'plan_id': str(plan_id),
                'day_id': str(dayid)
              }, 200


# Get a plan
@calendar_api.route('/api/GetPlan/<planid>', methods=['GET'])
def getplan(planid):
    plan = find_by_id(client, 'plans', planid)
    plan.pop('_id')
    if isinstance(plan, tuple):
        return plan
    return {
        'status': 'success',
        'plan': plan
    }, 200


# Update a plan
@calendar_api.route('/api/UpdatePlan', methods=['POST'])
def updateplan():
    body = request.get_json()
    plan_id = body['plan_id']
    plan = body['plan']
    try:
        client.db.plans.update_one({'_id': ObjectId(plan_id)}, {'$set': plan})
    except Exception as e:
        return {
            'status': 'fail to update plan',
            'error': str(e)
        }, 400
    return {
        'status': 'success',
        'plan_id': str(plan_id)
    }, 200


# Delete a plan
@calendar_api.route('/api/DeletePlan', methods=['POST'])
def deleteplan():
    # Delete the id from the day
    body = request.get_json()
    day_id = body['day_id']
    plan_id = body['plan_id']
    # Find the day
    target_day = find_by_id(client, 'days', day_id)
    if isinstance(target_day, tuple):
        return target_day
    # Delete the plan from the day
    plans = target_day['plans']
    if not plan_id in plans:
        return {
            'status': 'plan is not in the day',
        }, 404
    plans.remove(plan_id)
    # Update the day
    try:
        client.db.days.update_one({'_id': ObjectId(day_id)}, {'$set': {'plans': plans}})
        # Delete the plan from db.plans
        client.db.plans.delete_one({'_id': ObjectId(plan_id)})
    except Exception as e:
        return {
            'status': 'fail to delete plan from day or db',
            'error': str(e)
        }, 400

    return {
        'status': 'success',
        'plan_id': str(plan_id)
    }, 200
