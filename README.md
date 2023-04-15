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

## Demo
[TODO: Demo Video (1.5-3mins)]

StylEase is a mobile app that helps users manage their wardrobe and create stylish outfits. Here are the main features of the app, as described in the demo video:
- **Home**: The Home page of the app displays the StylEase logo, and will eventually include a feature that shows users the current weather in their area. This can help users plan their outfits based on the weather conditions.

- **Wardrobe**: The Wardrobe page is where users can view all of their uploaded clothing items. Users can easily add new items to their wardrobe by clicking the plus button in the bottom right corner of the screen. The search feature at the top of the screen allows users to quickly find a specific item in their wardrobe.

- **Outfit**: The Outfit page provides users with recommended outfits based on the app's AI algorithms. Users can also create their own outfits by selecting items from their wardrobe and customizing them. This allows users to experiment with different looks and find new outfit ideas.

- **Calendar**: The Calendar page allows users to plan their outfits in advance. Users can add new outfit plans by clicking the plus button in the bottom right corner of the screen. Each outfit plan can be customized by selecting items from the user's wardrobe. Users can also edit or delete existing outfit plans as needed.

- **Profile**: The Profile page will display user information such as their name, photo, and preferences. This page will also include settings features that allow users to customize the app to their liking. While this feature is not fully implemented yet, it will be an important part of the app for users who want to personalize their experience.
