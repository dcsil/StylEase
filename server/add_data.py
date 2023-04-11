import sys
sys.path.append('..')
from app import app

if __name__ == "__main__":
    # with open("test_image/bracelet.png", "rb") as img_file:
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
    #     "name": "David Yurman Bracelet",
    #     "user": "64237961038602a02a81cd92",
    #     "image": str(my_string),
    #     "created_time": "2023-03-15",
    #     "type": "Bracelet",
    #     "color": "Blue",
    #     "brand": "David Yurman",
    # }
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

    # with app.test_client() as client:
    #     response = client.get('/api/Getoutfitcollection/64237961038602a02a81cd92')
    #     print(response.data.decode('utf-8'))
    #
    # with app.test_client() as client:
    #     response = client.get('/api/GetOutfit/64237961038602a02a81cd92/642923806fc81a6ea84a433d')
    #     print(response.data.decode('utf-8'))

    # body =     {
    #     "creator": "64237961038602a02a81cd92",
    #     "created_time": "2023-03-17",
    #     "occasion": "CEO's birthday party",
    #     "style": "Business Casual",
    #     "items": ["64291e3aea96ab8185344b7b",
    #               "64291e958a0cda6951b3ac14",
    #               "64291f0e451e8ff87f993d49",
    #               "64291f784bfd243b92b97283",
    #               "64292012f6a6030c42002b71"],
    #      "budget": 5000,
    #      "is_AI": True
    #  }
    #
    # with app.test_client() as client:
    #     response = client.post('/api/AddNewOutfit', json=body)
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

    with app.test_client() as client:
        response = client.get('/api/GetWardrobeItems/64237961038602a02a81cd92')
        print(response.data.decode('utf-8'))