var path = require('path');
var express = require('express');
var VoiceResponse = require('twilio').twiml.VoiceResponse;
var urlencoded = require('body-parser').urlencoded;

var app = express();

// Parse incoming POST params with Express middleware
app.use(urlencoded({extended: false}));

// Create a route that will handle Twilio webhook requests, sent as an
// HTTP POST to /voice in our application
app.post('/voice', (request, response) => {
  // Use the Twilio Node.js SDK to build an XML response
  const twiml = new VoiceResponse();

  const gather = twiml.gather({
    numDigits: 2,
    action: '/gather',
  });
  gather.say('Hello. Please choose a number between one and ninety-nine to be fizz buzzed.');

  // If the user doesn't enter input, loop
  twiml.redirect('/voice');

  // Render the response as XML in reply to the webhook request
  response.type('text/xml');
  response.send(twiml.toString());
});

// Create a route that will handle <Gather> input
app.post('/gather', (request, response) => {
  // Use the Twilio Node.js SDK to build an XML response
  const twiml = new VoiceResponse();

  // If the user entered digits, process their request
  if (request.body.Digits) {
    var dig = parseInt(request.body.Digits);
    switch (dig) {
      case 0:
        twiml.say('Please choose a number greater than zero').pause();
        twiml.redirect('/voice');
        break;
      case dig > 99:
        twiml.say('Please choose a number less than one hundred.').pause();
        twiml.redirect('/voice');
        break;
      default:
      var output;
        for (var i=1; i<=num; i++) {
          output = "";
          if (num % 3 === 0) {output = "fizz ";}
          if (num % 5 === 0) {output = "buzz ";}
          if (output === "") {output = i.toString();}
          twiml.say(output);
        }
        break;
    }
  } else {
    // If no input was sent, redirect to the /voice route
    twiml.redirect('/voice');
  }

  // Render the response as XML in reply to the webhook request
  response.type('text/xml');
  response.send(twiml.toString());
});

// function fizzbuzz(num) {
//   var toSay = "";
//   var output;
//   for (var i=1; i<=num; i++) {
//     output = "";
//     if (num % 3 === 0) {output = "fizz ";}
//     if (num % 5 === 0) {output = "buzz ";}
//     if (output === "") {output = i.toString(); output += " ";}
//     toSay += output;
//   }
//   return toSay;
// }

// Create an HTTP server and listen for requests on port 3000
console.log('Twilio Client app HTTP server running at http://127.0.0.1:3000');
app.listen(3000);
