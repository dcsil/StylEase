# from transformers import pipeline
import base64
import io
from PIL import Image
import requests
import time

def detect(img):
    API_URL = "https://api-inference.huggingface.co/models/abhishek/autotrain_fashion_mnist_vit_base"
    headers = {"Authorization": "Bearer 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"}
    # Hugging face model https://huggingface.co/abhishek/autotrain_fashion_mnist_vit_base
    # object_detect = pipeline(task="image-classification", model="abhishek/autotrain_fashion_mnist_vit_base")
    # # Remove the heading Split by comma
    img = img.split(',')[1]
    # # Images are in raw base64 format, so we need to decode them into normal form (bytes)
    img = base64.b64decode(img)
    # https://stackoverflow.com/questions/32908639/open-pil-image-from-byte-file
    # Comment these line out if using pipeline
    # # # PIL's Image.open can only accept a string (representing a filename) or a file-like object, and
    # # # an io.BytesIO can act as a file-like object:
    # buf = io.BytesIO(img)
    # # # Use PIL to open bytes as an image
    # img = Image.open(buf)

    # # Detect the item
    # result = object_detect(img)
    # if result:
    #     return result[0]['label']
    # else:
    #     return "Nothing detected"
    response = requests.post(API_URL, headers=headers, data=img)
    # Wait for loading
    time.sleep(5)
    response = response.json()
    print(response)
    return response[0]['label']
