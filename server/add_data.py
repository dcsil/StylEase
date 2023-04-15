import sys
sys.path.append('..')
from app import app
import base64

if __name__ == "__main__":
    # with open("test_image/shoes.png", "rb") as img_file:
    #     my_string = base64.b64encode(img_file.read()).decode('utf-8')
    #     my_string = 'data:image/png;base64,{}'.format(my_string)

    # with open("test_image/hoodie.png", "rb") as img_file:
    #     my_string = base64.b64encode(img_file.read())
    # with open("test_image/pants.png", "rb") as img_file:
    #     my_string = base64.b64encode(img_file.read())
    # with open("test_image/shoes.png", "rb") as img_file:
    #     my_string = base64.b64encode(img_file.read())

        # my_string = str(my_string)
    # image = {
    #     'image': my_string
    # }
    # with app.test_client() as client:
    #     response = client.post('/api/ScanNewItem', json=image)
    #     print(response.data.decode('utf-8'))
    #
    # item = {
    #     "name": "Sneaker",
    #     "user": "6435f5a3ea5f65cdf025881d",
    #     "image": str(my_string),
    #     "created_time": "2023-04-01",
    #     "type": "",
    #     "color": "White",
    #     "brand": "Amiri",
    #     "market": False
    # }
    # # #
    # body = {
    #     'userid': "6435f5a3ea5f65cdf025881d",
    #     'item': item
    # }
    #
    # with app.test_client() as client:
    #     response = client.post('/api/AddNewItem', json=body)
    #     print(response.data.decode('utf-8'))
    #
    # item_id = response.json['item_id']
    #
    # body = {
    #     'userid': "6435f5a3ea5f65cdf025881d",
    #     'itemid': item_id
    # }
    #
    # with app.test_client() as client:
    #     response = client.post('/api/DeleteItem', json=body)
    #     print(response.data.decode('utf-8'))

    with app.test_client() as client:
        response = client.get('/api/GetWardrobeItems/6435f5a3ea5f65cdf025881d')
        print(response.data.decode('utf-8'))

    # with app.test_client() as client:
    #     response = client.get('/api/GetUser/64237961038602a02a81cd92')
    #     print(response.data.decode('utf-8'))

    # with app.test_client() as client:
    #     response = client.get('/api/GetItemImage/64237aef7bd7fa3c355dda94')
    #     print(response)

    # with app.test_client() as client:
    #     response = client.get('/api/Getoutfitcollection/64237961038602a02a81cd92')
    #     print(response.data.decode('utf-8'))
    #
    # with app.test_client() as client:
    #     response = client.get('/api/GetOutfit/64237961038602a02a81cd92/642923806fc81a6ea84a433d')
    #     print(response.data.decode('utf-8'))

    # outfit = {
    #     "creator": "6435f5a3ea5f65cdf025881d",
    #     "created_time": "2023-04-01",
    #     "occasion": "Bro's birthday party",
    #     "style": "Casual",
    #     "items": ["6435f753de08bc1aa531d3b1",
    #               "6435f7a199def560bc4e51d0",
    #               "6435f7cb053aa5049e92c83e",
    #               "6435f7e23161988ce7efa68b"],
    #      "budget": 5000,
    #      "is_AI": False
    #  }
    # body = {
    #     'outfit': outfit,
    #     'outfit_collection': "Default"
    # }
    #
    # with app.test_client() as client:
    #     response = client.post('/api/AddNewOutfit', json=body)
    #     print(response.data.decode('utf-8'))
    #
    # body = {
    #     'outfit_id': '6435fa8ff7c3fa9af405f876',
    #     'user_id': '6435f5a3ea5f65cdf025881d'
    # }
    #
    # with app.test_client() as client:
    #     response = client.post('/api/DeleteOutfit', json=body)
    #     print(response.data.decode('utf-8'))

    # outfitcollection = {
    #         'name': 'Default',
    #         "owner": '6435f5a3ea5f65cdf025881d',
    #         "created_time": '2023-04-01',
    #         "outfits": []
    #     }
    # body = {
    #     'outfit_collection': outfitcollection,
    #     'userid': '6435f5a3ea5f65cdf025881d'
    # }
    #
    # with app.test_client() as client:
    #     response = client.post('/api/AddNewCollection', json=body)
    #     print(response.data.decode('utf-8'))
    #
    # collect_id = response.json['collection_id']
    # print(collect_id)
    #
    # body = {
    #     'collection_id': collect_id,
    #     'userid': '6435f5a3ea5f65cdf025881d'
    # }
    #
    # with app.test_client() as client:
    #     response = client.post('/api/DeleteCollection', json=body)
    #     print(response.data.decode('utf-8'))



    # body = {
    #     'email': "zhoueric0603@gmail.com",
    #     'password': 'test'
    # }
    #
    # with app.test_client() as client:
    #     response = client.post('/api/Login', json=body)
    #     print(response.data.decode('utf-8'))


    # body = {"user": "64237961038602a02a81cd92",
    #         "name": "Meeting with Professor Li",
    #         "date": "2022-04-13",
    #         "createdTime": "2022-04-08",
    #         "planned_outfits": [
    #             "642923806fc81a6ea84a433e"
    #           ],
    #         "occasion": ""}
    # with app.test_client() as client:
    #     response = client.post('/api/AddPlanToDay', json=body)
    #     print(response.data.decode('utf-8'))

    # with app.test_client() as client:
    #     response = client.get('/api/GetAllDays/64237961038602a02a81cd92')
    #     print(response.data.decode('utf-8'))
    # Return example
    # {"days": [{"_id": "643348e69d79a18b19781a10", "date": "2022-04-12",
    #            "plans": ["643348269d79a18b19781a0c", "643348269d79a18b19781a0e"]},
    #           {"_id": "643348e69d79a18b19781a11", "date": "2022-04-14",
    #            "plans": ["643348269d79a18b19781a0d"]}],
    #  "status": "success"}

    # plan = {"user": "64237961038602a02a81cd92",
    #         "name": "Meeting with Professor Li and Professor Zhao",
    #         "date": "2022-04-13",
    #         "createdTime": "2022-04-08",
    #         "planned_outfits": [
    #             "642923806fc81a6ea84a433e",
    #             "642dfe6f166f4a71e89369f1"
    #           ],
    #         "occasion": ""}
    # body = {
    #     'plan': plan,
    #     'plan_id': "64335f04ab8bb7cdb0fc9498"
    # }
    #
    # with app.test_client() as client:
    #     response = client.post('/api/UpdatePlan', json=body)
    #     print(response.data.decode('utf-8'))

    # body = {
    #     'plan_id': "64335f04ab8bb7cdb0fc9498",
    #     'day_id': "64335f06ab8bb7cdb0fc9499"
    # }
    #
    # with app.test_client() as client:
    #     response = client.post('/api/DeletePlan', json=body)
    #     print(response.data.decode('utf-8'))

    # with app.test_client() as client:
    #     response = client.get('/api/GetOutfit/64237961038602a02a81cd92/642923806fc81a6ea84a433d')
    #     print(response.data.decode('utf-8'))

    # Get plan
    # with app.test_client() as client:
    #     response = client.get('/api/GetPlan/643348269d79a18b19781a0c')
    #     print(response.data.decode('utf-8'))

    # with app.test_client() as client:
    #     response = client.get('/api/GetWardrobeItems/64237961038602a02a81cd92')
    #     print(response.data.decode('utf-8'))

    # with app.test_client() as client:
    #     response = client.get('/api/GetPlan/643348269d79a18b19781a0c')
    #     print(response.data.decode('utf-8'))

    # body = {
    #     'name': 'test_user',
    #     'email': 'testing',
    #     'password': 'testing'
    # }
    #
    # with app.test_client() as client:
    #     response = client.post('/api/Register', json=body)
    #     print(response.data.decode('utf-8'))

    # body = {
    #     'userid': "6435f5a3ea5f65cdf025881d",
    #     'itemid': '64237aef7bd7fa3c355dda11'
    # }
    #
    # with app.test_client() as client:
    #     response = client.post('/api/DeleteItem', json=body)
    #     print(response.data.decode('utf-8'))

    # with app.test_client() as client:
    #     response = client.get('/api/Getoutfitcollection/6435f5a3ea5f65cdf025881d')
    #     print(response.data.decode('utf-8'))

    # with app.test_client() as client:
    #     response = client.get('/api/GetOutfit/6435f5a3ea5f65cdf025881d/6435f8e40b57cf80541c8037')
    #     print(response.data.decode('utf-8'))

    # with app.test_client() as client:
    #     response = client.get('/api/GetUser/6435f5a3ea5f65cdf025881d')
    #     print(response.data.decode('utf-8'))
