from flask import *
from server.apis.detection import detect
import base64
import io
from flask import Blueprint
from server.database import client

clothing_api = Blueprint('clothing_api', __name__)


# Clothing methods
@clothing_api.route('/api/ScanNewItem', methods=['POST'])
def detect_item():
    body = request.get_json()
    # userid = body['userid']
    # In the format of "data:image/png;base64,iVBORw...."
    img = body['image']
    # Detect Item
    item_name = detect(img)
    if item_name == "Nothing detected":
        return {
            'status': 'No Item Found',
        }, 400
    else:
        return {
            'status': 'success',
            'item': item_name
        }, 200


@clothing_api.route('/api/AddNewItem', methods=['POST'])
def addNewItem():
    body = request.get_json()
    userid = body['userid']
    item = body['item']
    # Add type of the item
    item['type'] = detect(item['image'])
    # item['type'] = "Suit"
    # Add new item to db.items
    item_id = client.db.items.insert_one(item).inserted_id
    # Add the item to the user's WARDROBE if userid is given
    if userid != '' and not item['market']:
        try:
            target = find_by_id(client, 'users', userid)
            wardrobe_id = target['wardrobe']
            wardrobe = find_by_id(client, 'wardrobes', wardrobe_id)
            if isinstance(wardrobe, tuple):
                return wardrobe
            current_items = wardrobe['items']
            item_id = str(item_id)
            current_items.append(item_id)
            client.db.wardrobes.update_one({'_id': ObjectId(wardrobe_id)}, {'$set': {'items': current_items}})
        except Exception as e:
            return {
                'status': 'fail to update',
                'error': str(e)
            }, 400

    return {
        'status': 'success'
    }, 200


@clothing_api.route('/api/AddNewOutfit', methods=['POST'])
def addNewOutfit():
    body = request.get_json()
    outfit = body['outfit']
    outfit_collection = body['outfit_collection']
    # Add new outfit to db.outfits
    outfit_id = client.db.outfits.insert_one(outfit).inserted_id
    # Add the outfit to the user's WARDROBE
    target = find_by_id(client, 'users', outfit['creator'])
    outfits_lst = target['outfits']
    outfit_id = str(outfit_id)
    outfits_lst.append(outfit_id)
    try:
        client.db.users.update_one({'_id': ObjectId(outfit['creator'])}, {'$set': {'outfits': outfits_lst}})
        # Add the outfit to the user's outfit collection
        if outfit_collection != '':
            for collection in target["outfit_collections"]:
                collection_target = find_by_id(client, 'outfitcollections', collection)
                if collection_target['name'] == outfit_collection:
                    collection_target['outfits'].append(outfit_id)
                    client.db.outfitcollections.update_one({'_id': ObjectId(collection)}, {'$set': {'outfits': collection_target['outfits']}})
                    break
        return {
            'status': 'success'
        }, 200
    except Exception as e:
        return {
            'status': 'fail to update',
            'error': str(e)
        }, 400

@clothing_api.route('/api/AddNewCollection', methods=['POST'])
def addNewCollection():
    body = request.get_json()
    userid = body['userid']
    collection = body['outfit_collection']
    try:
        # Add new collection to db.outfitcollections
        collection_id = client.db.outfitcollections.insert_one(collection).inserted_id
        # Add the collection to the user's WARDROBE
        target = find_by_id(client, 'users', userid)
        if isinstance(target, tuple):
            return target
        collections_lst = target['outfit_collections']
        collection_id = str(collection_id)
        collections_lst.append(collection_id)
        client.db.users.update_one({'_id': ObjectId(userid)}, {'$set': {'outfit_collections': collections_lst}})
    except Exception as e:
        return {
            'status': 'fail',
            'error': str(e)
        }, 400
    return {
        'status': 'success'
    }, 200

@clothing_api.route('/api/GetItemImage/<itemid>', methods=['GET'])
def getItemimg(itemid):
    item = find_by_id(client, 'items', itemid)
    if isinstance(item, tuple):
        return item
    # Image is in base64 format
    img = item['image']
    img_string = img.split(',')[1]

    # Decode the base64 string to binary and Use io.BytesIO to convert the binary to bytes
    img = io.BytesIO(base64.b64decode(img_string))
    # Send the image to the user
    response = make_response(img)
    response.headers.set('Content-Type', 'image/jpeg')
    # response.headers.set('Content-Length', len(img_string))

    return response, 200

    # return send_file(img, mimetype='image/jpeg')


@clothing_api.route('/api/GetWardrobeItems/<userid>', methods=['GET'])
def getWardrobeItems(userid):
    target = find_by_id(client, 'users', userid)
    if isinstance(target, tuple):
        return target
    if target['wardrobe']:
        wardrobe_id = target['wardrobe']
        wardrobe = find_by_id(client, 'wardrobes', wardrobe_id)
        if isinstance(wardrobe, tuple):
            return wardrobe
        items = wardrobe['items']

        items_lst = get_items(client, items)
        wardrobe['items'] = items_lst
        wardrobe['_id'] = str(wardrobe['_id'])

        return {
            'status': 'success',
            'wardrobe': wardrobe
        }, 200
    else:
        return {
            'status': 'user has no wardrobe',
        }, 404


@clothing_api.route('/api/Getoutfitcollection/<userid>', methods=['GET'])
def getOutfitCollection(userid):
    target = find_by_id(client, 'users', userid)
    if isinstance(target, tuple):
        return target
    outfit_collections_lst = []
    if target['outfit_collections']:
        outfit_collections_id_lst = target['outfit_collections']
        for outfits_collection_id in outfit_collections_id_lst:
            outfits_collection = find_by_id(client, 'outfitcollections', outfits_collection_id)
            if isinstance(outfits_collection, tuple):
                return outfits_collection
            outfits_lst = []
            for outfit in outfits_collection['outfits']:
                outfit = find_by_id(client, 'outfits', outfit)
                if isinstance(outfit, tuple):
                    return outfit
                outfit['_id'] = str(outfit['_id'])
                items = outfit['items']
                items_lst = get_items(client, items)
                outfit['items'] = items_lst
                outfits_lst.append(outfit)
            outfits_collection['outfits'] = outfits_lst
            outfits_collection['_id'] = str(target['_id'])
            outfit_collections_lst.append(outfits_collection)
    status = 'success' if outfit_collections_lst else 'user has no outfit collections'
    return {
        'status': status,
        'outfit_collections': outfit_collections_lst
    }, 200


# Present formated outfits to the user
@clothing_api.route('/api/GetOutfit/<userid>/<outfitid>', methods=['GET'])
def getOutfit(userid, outfitid):
    target = find_by_id(client, 'users', userid)
    if target['outfits']:
        outfits_id_lst = target['outfits']
        if outfitid in outfits_id_lst:
            outfit = find_by_id(client, 'outfits', outfitid)
            if isinstance(outfit, tuple):
                return outfit
            outfit['_id'] = str(outfit['_id'])
            items = outfit['items']
            items_lst = get_items(client, items)
            outfit['items'] = items_lst
            return {
                'status': 'success',
                'outfit': outfit
            }, 200
        else:
            return {
                'status': 'outfit not found',
            }, 404
    else:
        return {
            'status': 'user has no outfit',
        }, 404

# Create AI outfit
@clothing_api.route('/api/CreateAIOutfit', methods=['POST'])
def createAIOutfit():
    data = request.get_json()
    outfit = data['outfit']
    # Hard Code
    # get item 64237ecfa77fdcf57203ff96
    items = [
        {'_id': '64237ecfa77fdcf57203ff96', 'user': '64237961038602a02a81cd92'},
        {'_id': '642c9b687032063a2f2f1e78', 'user': ''}
    ]
    if data['regenerate']:
        # Suggest items 642c9b687032063a2f2f1e78, 642c9a701f8bd8fef92cbf18,
        # 642c9a27756f6d8ab3562456, 642c99a94146ee0f23e68bf6
        items.append([
            {'_id': '642c9a701f8bd8fef92cbf18', 'user': ''},
            {'_id': '642c9a27756f6d8ab3562456', 'user': ''},
            {'_id': '642c99a94146ee0f23e68bf6', 'user': ''}
        ])
    else:
        items.append([
            {'_id': '64237df5ad0c1edddca0f8dc', 'user': '64237961038602a02a81cd92'},
            {'_id': '642c96dcbaac041ea8a98a01', 'user': ''},
            {'_id': '642c9a4d917524429c1bf982', 'user': ''}
        ])

    outfit['items'] = items

    return {
        'status': 'success',
        'ai_outfit': outfit
    }, 200