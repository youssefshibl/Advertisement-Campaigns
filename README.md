# 🛸 Backend Service For  Measuring Conversions for AdvertisementCampaigns

backend solution for tracking and measuring conversions for advertisement campaigns using QR
codes , include generating QR codes linked to specific campaigns, tracking scans, and
measuring conversions

## 🚀 Architecture
![ScreenShot](/docs/arch.png)

## 🔫 Flow of the service

1. User creates a campaign with a name and a target info (URL, phone number, etc)
2. User generates a QR code for the campaign
    + Get id of the campaign
    + Get URL which related to the campaign
    + Generate QR code with the URL
    + Shares the QR code with Users
3. User scans the QR code
4. QR code scanner sends a request to the backend Service with the campaign id
5. Backend Service Save the information of the scan in the database
6. Backend Service check the agent of the request
    + If the agent is a browser, redirect the user to the target URL
    + If the agent is a mobile app, redirect the user to App which related to the campaign
    + this redirection contain uuid of the user which scanned the QR code and the token of this user 
7. After user redirected to the company's website or app, the company can track the user's behavior and measure the conversion rate
8. Any Event happens in the company's website or app, the company can send this event to the backend service with the uuid of the user and token of the user for authentication which stored in the redis to make service `stateless`


## Demo


[![Screenshot from 2024-07-13 18-18-21](https://github.com/user-attachments/assets/81efe9b1-de4e-4abf-8b03-2a60291705b3)](https://github.com/user-attachments/assets/60880743-2271-4109-be3e-d19e25a473cd)



1. Run `start.sh` to start the service this will start the following services
    + MongoDB container
    + Redis container
    + Clean the database and insert dummy data `seeds`
    + Start Frontend services one for generating QR code and the other is web app for the company



