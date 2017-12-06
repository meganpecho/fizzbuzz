var path = require('path');
var express = require('express');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var twilio = require('twilio');
var VoiceResponse = twilio.twiml.VoiceResponse;
var config = require('../config');
require('dotenv').load();

// Create a Twilio REST API client for authenticated requests to Twilio
//var client = twilio(config.accountSid, config.authToken);
var client = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_TOKEN);

// Configure application routes
module.exports = function(app) {
    // Set Jade as the default template engine
    app.set('view engine', 'jade');

    // Express static file middleware - serves up JS, CSS, and images from the
    // "public" directory where we started our webapp process
    app.use(express.static(path.join(process.cwd(), 'public')));

    // Parse incoming request bodies as form-encoded
    app.use(bodyParser.urlencoded({
        extended: true,
    }));

    // Use morgan for HTTP request logging
    app.use(morgan('combined'));

    // Home Page with Click to Call
    app.get('/', function(request, response) {
        response.render('index');
    });

    // Handle an AJAX POST request to place an outbound call
    app.post('/call', function(request, response) {
        var phoneNumber = request.body.phoneNumber;
        var url = 'http://' + request.headers.host + '/voice'; //does not like localhost. why, I don't know.
        client.api.calls
          .create({
            url: url,
            to: phoneNumber,
            from: process.env.TWILIO_NUMBER,
          })
          .then((message) => {
            console.log(message.responseText);
            response.send({
                message: 'Thank you! We will be calling you shortly.',
            });
          })
          .catch((error) => {
            console.log(error);
            response.status(500).send(error);
          });
    });

    app.post('/voice', (request, response) => {
      // Use the Twilio Node.js SDK to build an XML response
      var twiml = new VoiceResponse();
      // twiml.dial(phoneNumber);
      var gather = twiml.gather({
        action: '/gather',
        finishOnKey: '#'
      });
      gather.say('Please enter a number between one and ninety-nine to be fizz buzzed, then hit pound.');

      // If the user doesn't enter input, loop
      twiml.redirect('/voice');

      // Render the response as XML in reply to the webhook request
      response.type('text/xml');
      response.send(twiml.toString());
    });

    app.post('/gather', (request, response) => {
      // Use the Twilio Node.js SDK to build an XML response
      const twiml = new VoiceResponse();

      // If the user entered digits, process their request
      if (request.body.Digits) {
        var digit = parseInt(request.body.Digits);
        if (digit === 0) {
            twiml.say('Please choose a number greater than zero');
            twiml.redirect('/voice');
        }
        if (digit > 99) {
            twiml.say('Please choose a number less than one hundred.');
            twiml.redirect('/voice');
        }
        else {
            var output;
            for (var i=1; i<=digit; i++) {
              output = "";
              if (i % 3 === 0) {output = "fizz ";}
              if (i % 5 === 0) {output = "buzz ";}
              if (output === "") {output = i.toString();}
              twiml.say(output);
            }
        }
      } else {
        // If no input was sent, redirect to the /voice route
        twiml.redirect('/voice');
      }

      // Render the response as XML in reply to the webhook request
      response.type('text/xml');
      response.send(twiml.toString());
    });
};
