# Readme 


## Getting Started

### Mac
**Recommended: using android studio for emulator**
*Since the app is designed for android, using an android emulator is strongly recommended*

- Download android studio
- On the welcome page, click on the three dots in the right corner, and then click "Virtual device manager"
- A new screen will open, click on "Create device"
- Chose the phone model you want, click next, chose an API level that is minimum 33 (Tiramisu is recommended), click on next and then finish.
- Now the phone you created is on your device manager, click on the play symbol (launch this AVD in the emulator)

- You can now go back to your project in VS and open the root of the project (eml)
- Run the following in the terminal: 
```
npm i
```
You will get a lot of warnings, ignore them for now :)
```
expo start
```
- Now press "a" to launch the android emulator when prompted
- Wait for the emulator to start (this can take a lot of time)
- Press "r" to restart, sometimes this is a good idea if the app won’t bundle. 


**Alternative: using xcode for IOS emulato**
*Since the app is designed for android, this is not recommended*

- Download Xcode and run it once (make sure to select and install the iPhone emulator if prompted during installation)
- Open the repository in your editor (all of the commands below should be executed in the root folder)
- Run the following in the terminal: 
```
sudo npm install expo-cli
```
- Run the following in the terminal:
```
expo start
```
- You will be prompted if you have any missing/outdated packages. In this case, follow the instructions in the terminal
- Run: "expo start" and press "i" to launch the iOS emulator when prompted
- Wait for the emulator to start

[MAC FIX: IF XCODE IS INSTALLED BUT IS NOT SEEN BY THE APP]
- Run the following in the terminal: "sudo xcode-select -s /Applications/Xcode.app/Contents/Developer"

### Windows
- Download and install Android Studio following this guide (https://docs.expo.dev/workflow/android-studio-emulator/)
- Open Environment Variable settings in Windows
- Find the "Path" variable under system variables and click edit, then add "C:\Users\<your_username_here>\AppData\Local\Android\Sdk\platform-tools"
- Clone the educado-mobile repo from github
- Make sure the educado-backend is running, to use functionalities (eg. logging in)
- in `eml/api/userApi.js` and `eml/api/api.js` remember to change the urls to your local IP when testing. eg:
```javascript

const url = 'http://172.30.245.212:8888'; // change to lcd ip when testing
const certificateUrl = 'http://172.30.245.212:8080';

```
- Open the directory eml in terminal
- Write and run the following in the terminal:
  ```
  npm start
  ```
- When given a QR code and some options like -a for android, -r for restart: press "a"
- Wait until the app starts on the device
- If you receive errors, make sure to run `npm i` to install missing dependencies and try running again

### Use own phone as emulator with Expo Go (Android)
- Go to your phones system settings and find the "About device" button and press it.
<img src="https://github.com/Educado-App/educado-mobile/assets/100210077/c54c651b-8f2a-45cc-86ff-0e5191ca7e7d" width="250">

- In "About device" find the "build-number", the location can vary from phone to phone, it can be under "Version"
<img src="https://github.com/Educado-App/educado-mobile/assets/100210077/1ec176c8-226e-4b28-8131-5d0006019896" width="250">

- When you have located the "build-number" press it 7-10 times and you should get a message that you have unlocked dev mode.
<img src="https://github.com/Educado-App/educado-mobile/assets/100210077/48f2e0cd-4f00-4a32-932f-6e65bc282483" width="250">

- Now you should be able to find "developer options" somewhere in your settings, again this can vary, it could be under "Additional settings".
<img src="https://github.com/Educado-App/educado-mobile/assets/100210077/d9ed6bbb-88d1-46f5-ad3b-7192f6fe21ab" width="250">
<img src="https://github.com/Educado-App/educado-mobile/assets/100210077/eebde1a7-3ae6-48fa-914a-8b80e89999b2" width="250">

- When you have found the "developer settings" you have to find and enable "USB Debugging".
<img src="https://github.com/Educado-App/educado-mobile/assets/100210077/84c02c79-72f1-4073-a39c-491a9e841fb5" width="250">

- Now your phone can download files and/or apps properly through USB.
- Connect your phone to your computer through USB and you should get a notification on your phone, select file transfer on the notification.
- Now you open educado-mobile on your IDE and run it as usual with "npm start".
- When you get the QR-code and other options press "shift+a" to view all available android devices.
- Select your own device and it should begin downloading the Expo Go app on your phone.
- When it has been downloaded, you should go and stop the Expo Go app from trying to update to avoid future issues, here is a link on how: (https://www.makeuseof.com/disable-auto-update-android-apps/)
- With the app downloaded you can turn off the USB debugging option if you want, but you should be ready to use your own phone wirelessly as an emulator with Expo Go.
- To use your phone wirelessly you have to be on the same wifi/internet as your computer and scan the QR code with the Expo Go app when you run your code.

## Images of the app
<img src= "https://github.com/Educado-App/educado-mobile/assets/92582321/815d55a1-dbf2-4fec-bc08-866603f510ac" width="180">
<img src= "https://github.com/Educado-App/educado-mobile/assets/92582321/75f8c4e8-c341-47df-9571-207b88301f2c" width="180">
<img src= "https://github.com/Educado-App/educado-mobile/assets/92582321/28739181-d904-41dc-b831-e153b66e9956" width="180">
<img src= "https://github.com/Educado-App/educado-mobile/assets/92582321/26fac1c8-d471-4686-a4c2-d3234b8dbb70" width="180">
<img src= "https://github.com/Educado-App/educado-mobile/assets/92582321/a5d91fac-a652-440c-bd7a-67f54e042a20" width="180">
<img src= "https://github.com/Educado-App/educado-mobile/assets/92582321/cf9a12e6-1df9-4aaa-86d1-bde16b0659ae" width="180">
<img src= "https://github.com/Educado-App/educado-mobile/assets/92582321/ab3b2262-7b85-40c2-a2d0-17ed24717660" width="180">
<img src= "https://github.com/Educado-App/educado-mobile/assets/92582321/b54971f4-a012-42ac-9d6a-9653d4cd8464" width="180">
<img src= "https://github.com/Educado-App/educado-mobile/assets/92582321/0079dead-d1d9-4e8f-8391-a1db8ff5a3c5" width="180">
<img src= "https://github.com/Educado-App/educado-mobile/assets/92582321/93ec1bf8-bb58-4620-9557-72d99b64037c" width="180">
<img src= "https://github.com/Educado-App/educado-mobile/assets/92582321/5bdc84c0-ee6d-486f-910f-99ab9c3465ae" width="180">
<img src= "https://github.com/Educado-App/educado-mobile/assets/92582321/178a1378-d568-4160-b8a9-5f1d10e8c047" width="180">
<img src= "https://github.com/Educado-App/educado-mobile/assets/92582321/d4db021b-88d1-4553-af44-5ff551dc8396" width="180">
<img src= "https://github.com/Educado-App/educado-mobile/assets/92582321/7822eb76-e953-4c65-a74d-135942fbef29" width="180">
<img src= "https://github.com/Educado-App/educado-mobile/assets/92582321/54592297-4b86-4000-873e-852f5366049d" width="180">
<img src= "https://github.com/Educado-App/educado-mobile/assets/92582321/e3163710-570f-4631-b333-d60aeb4ff511" width="180">
<img src= "https://github.com/Educado-App/educado-mobile/assets/92582321/5dd2f9c4-0256-4a39-8c9d-a0f029f403b9" width="180">
<img src= "https://github.com/Educado-App/educado-mobile/assets/92582321/e019c342-ab4b-450b-8b39-42de6eff943f" width="180">
<img src= "https://github.com/Educado-App/educado-mobile/assets/92582321/5de5f66b-f140-41dd-a1d8-d3380cec6ff9" width="180">
<img src= "https://github.com/Educado-App/educado-mobile/assets/92582321/19874314-5eef-499a-94da-052d8f0191a5" width="180">

### Offline mode:
*Can only be tested on your own phone or emulator when the app is downloaded, not with expo go*
*However, as an alternative, if you are running on local backend, you can dissconnect the backend to simulate no internet connection*

- Without downnloaded courses:
<img src= "https://github.com/Educado-App/educado-mobile/assets/92582321/c5095e43-1b57-4b4c-bcf4-8b2d28965b11" width="250">

- How to download on online: click on the cloud/download button:
<img src= "https://github.com/Educado-App/educado-mobile/assets/92582321/0b9f5c8b-0228-4ffd-968c-4c127ad917e5" width="250">
<img src= "https://github.com/Educado-App/educado-mobile/assets/92582321/a4988a71-0eb4-4b22-b73b-3d5bc068ccbc" width="250">

- Then go offline, the course is no more grayified, and all sections/lectures/exercises within the course can be accessed.
<img src= "https://github.com/Educado-App/educado-mobile/assets/92582321/ac8f9349-bb21-4531-af88-b534942e63e1" width="250">
<img src= "https://github.com/Educado-App/educado-mobile/assets/92582321/5f530c39-5526-410f-ba98-dcb5d47dcc49" width="250">

