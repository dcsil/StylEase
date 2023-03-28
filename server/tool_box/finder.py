from bson import ObjectId


def find_day_by_date(client, target, date):
    if target:
        days = target['days']
        # Find the days that have the same date
        for day in days:
            date_db = client.db.days.find_one({'_id': ObjectId(day)})
            if date_db:
                if date_db['date'] == date:
                    return date_db
                return {
                           'status': 'date not match',
                       }, 404

            return {
                    'status': 'date is not found',
                   }, 404
    return {
               'status': 'user not found',
           }, 500
