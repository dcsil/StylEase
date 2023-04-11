import os
import sys
sys.path.append('..')
# print("SYSPATH")
# print(sys.path)
from server.app import app
import base64

# Test scan item
def test_scan_new_item_endpoint():
    print(os.path)
    with open("tests/unit/test.png", "rb") as img_file:
        my_string = base64.b64encode(img_file.read()).decode('utf-8')
        my_string = 'data:image/png;base64,{}'.format(my_string)

    image = {
        'image': my_string
    }
    with app.test_client() as client:
        response = client.post('/api/ScanNewItem', json=image)
        print(response.data.decode('utf-8'))
        assert response.status_code == 200
        assert response.data.decode('utf-8') == '{"item":"Shirt","status":"success"}\n'
