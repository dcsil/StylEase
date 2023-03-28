from transformers import pipeline
import base64
import io
from PIL import Image


def detect(img):
    object_detect = pipeline(task="image-classification", model="abhishek/autotrain_fashion_mnist_vit_base")
    # Images are in base64 format, so we need to decode them
    img = base64.decodebytes(img)
    # Use io.BytesIO to convert the base64 string to bytes
    buf = io.BytesIO(img)
    # Use PIL to convert the bytes to an image
    img = Image.open(buf)
    # Detect the item
    result = object_detect(img)
    if result:
        return result[0]['label']
    else:
        return "Nothing detected"