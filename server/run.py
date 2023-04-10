from server.app import app
import os
from dotenv import load_dotenv


if __name__ == "__main__":
    load_dotenv()
    # print(os.environ.get('test'))
    # print(os.environ.get("MONGODB_URL"))
    app.run(host='0.0.0.0', debug=True, port=int(os.environ.get('PORT', 7000)))