# FizzerBuzzer -- LendUp Challenge
A web application that calls the entered number and has the person called choose a number to be fizzbuzzed.

### Live Version
The live version lives here: [https://fizzerbuzzer.herokuapp.com/](https://fizzerbuzzer.herokuapp.com/). (This can only call verified numbers as it is a trial Twilio account.)

But if you want to run it locally, below is the configuration.

### Configuration

##### Set your environmental variables
Create a file and call it  `.env`. Here you will set your:
```
TWILIO_ACCOUNT_SID=AC********************************* //Fake
TWILIO_AUTH_TOKEN=8******************************* //Fake
TWILIO_NUMBER=+16305550129 //Fake
```
Run `npm install dotenv --save` in the root folder.

##### Make it run
1. Run `npm install` in the root folder
2. Start your ngrok with `ngrok http 3000` (or `./ngrok http 3000` for Terminal)
3. Set you Twilio webhook to your specific `http://********.ngrok.io/voice` address
4. Run `node app.js`
5. Open your specific `http://********.ngrok.io` in a browser (preferably Chrome), no `/voice`
6. Boom. Done. Call someone.


---
As a note, I relied heavily on [this](https://www.twilio.com/docs/tutorials/click-to-call-node-express) Twilio tutorial to do this project. Some of the code will be exactly the same as I had never worked with Twilio nor had I created a Node project from scratch before. So this helped me to get it started.
