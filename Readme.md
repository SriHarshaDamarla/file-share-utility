**Simple File Sharing Utility**

- This project is currently in its early development phase. As I’m still learning Node.js and React, any feedback or suggestions would be greatly appreciated. You can also expect several enhancements in the near future.
- How to use:
  1. Create a .env file in server folder with BASE_FILE_PATH variable pointing to the home directory to be shown in UI.  
     _Note: Do not add file separator at the end of path it can cause some issues_
  2. Create a .env file in UI folder with SERVER_URI variable pointing to the server instance and port that is currently running
  3. Once both the backend and UI instances are running in the UI you can navigate to various folders and just click on the files that you want to share from the server
  4. In client side once you are connected to the server you will be able to see the files that server wants to share, you just have to click on the needed files to download it individually.
