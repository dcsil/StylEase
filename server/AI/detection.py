from transformers import pipeline
import base64
import io
from PIL import Image


def detect(img):
    object_detect = pipeline(task="image-classification", model="abhishek/autotrain_fashion_mnist_vit_base")
    img = base64.decodebytes(img)
    buf = io.BytesIO(img)
    img = Image.open(buf)
    result = object_detect(img)
    if result:
        return result[0]['label']
    else:
        return "Nothing detected"