from app import app
import os

if __name__ == "__main__":
    # print(os.environ.get("MONGODB_URL"))
    app.run(debug=True, port=int(os.environ.get('PORT', 7000)))