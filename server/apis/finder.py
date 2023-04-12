from bson import ObjectId


def find_by_id(client, collection, obj_id):
    target = client.db[collection].find_one({'_id': ObjectId(obj_id)})
    if target:
        return target
    return {'status': 'fail', 'error': f'{collection} not found'}, 404


def find_day_by_date(client, target, date):
    # if target:
    days = target['days']
    # Find the days that have the same date
    for day in days:
        # date_db = client.db.days.find_one({'_id': ObjectId(day)})
        date_db = find_by_id(client, 'days', day)
        if isinstance(date_db, tuple):
            return date_db
        if date_db['date'] == date:
            return date_db
        # return {
        #            'status': 'date not match',
        #        }, 404
    return {
            'status': 'date is not found',
           }, 404
    # return {
    #            'status': 'user not found',
    #        }, 500


def get_items(client, items):
    items_lst = []
    for item in items:
        item = find_by_id(client, 'items', item)
        if isinstance(item, tuple):
            return item
        item.pop('image')
        item['_id'] = str(item['_id'])
        items_lst.append(item)
    return items_lst