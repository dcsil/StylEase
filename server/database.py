import pymongo
import os
from dotenv import load_dotenv
import certifi

load_dotenv()
client = pymongo.MongoClient(os.environ.get("MONGODB_URL"),  tlsCAFile=certifi.where())

