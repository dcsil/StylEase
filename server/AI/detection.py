from transformers import pipeline
import base64
import io
from PIL import Image


def detect(img):
    object_detect = pipeline(task="image-classification", model="abhishek/autotrain_fashion_mnist_vit_base")
    # # Split by comma
    img = img.split(',')[1]
    # # Images are in base64 format, so we need to decode them into normal form
    img = base64.b64decode(img)
    # # PIL's Image.open can accept a string (representing a filename) or a file-like object, and
    # # an io.BytesIO can act as a file-like object:
    buf = io.BytesIO(img)
    # # Use PIL to open bytes as an image
    img = Image.open(buf)

    # Detect the item
    result = object_detect(img)
    if result:
        return result[0]['label']
    else:
        return "Nothing detected"