## Development Setup

1. Clone the repository.
2. (For Ubuntu 20.04) Navigate to the root directory and run the bootstrap script. This will set up the environment and install all required dependencies. This script only works on Ubuntu 20.04. If your machine do not have Python 3.10 installed, you can uncomment the corresponding part in the script.

    ```{bash}
    script/bootstrap
    ```

3. (For other OS) You need to install [MongoDB Community Edition](https://www.mongodb.com/docs/manual/administration/install-community/) if you want to develop without connecting to our MongoDB Atlas. Make sure NodeJS and Python3.10 are installed on your machine.
   - Install node dependencies and expo-cli for client:

        ```{bash}
        cd client/
        npm install
        npm install -g expo-cli
        ```

   - Create virtual environment and install python packages for server:

        ```{bash}
        cd server/
        python3 -m venv venv

        # Bash/macOS
        source venv/bin/activate
        # Windows
        .\venv\Script\activate

        pip install -r requirements.txt
        ```

4. In the `./client` and `./server` folders, the above script has generated `.env` files. Make sure to modify the placeholder strings.
