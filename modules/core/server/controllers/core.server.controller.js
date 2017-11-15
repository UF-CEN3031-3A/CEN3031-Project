'use strict';

var validator = require('validator'),
  path = require('path'),
  config = require(path.resolve('./config/config')),
  nodemailer = require('nodemailer');

/*
TODO FOR THIS MODULE - tessbianchi
---
- Get SendGrid setup (Need Heroku and credit card)
- Add environment variables to Heroku App
- Change the two remove statements below to work
*/


/*
REMOVE!

Eventually this should be:
var transporter = nodemailer.createTransport({
  service: config.mailer.options.service
  auth: config.mailer.options.auth
});

*/

var transporter = nodemailer.createTransport({
  host: "smtp.mail.com",
  port: 465,
  secure: true, // use TLS
  auth: {
    user: "cen3031_3a_f17@mail.com",
    pass: "Password!23"
  }
});

// verify connection configuration
transporter.verify(function(error, success) {
   if (error) {
        console.log(error);
   } else {
        console.log('Server is ready to take our messages');
   }
});


/**
 * Render the main application page
 */
exports.renderIndex = function (req, res) {
  var safeUserObject = null;
  if (req.user) {
    safeUserObject = {
      displayName: validator.escape(req.user.displayName),
      provider: validator.escape(req.user.provider),
      username: validator.escape(req.user.username),
      created: req.user.created.toString(),
      roles: req.user.roles,
      profileImageURL: req.user.profileImageURL,
      email: validator.escape(req.user.email),
      lastName: validator.escape(req.user.lastName),
      firstName: validator.escape(req.user.firstName),
      additionalProvidersData: req.user.additionalProvidersData
    };
  }

  res.render('modules/core/server/views/index', {
    user: JSON.stringify(safeUserObject),
    sharedConfig: JSON.stringify(config.shared)
  });
};

/**
 * Render the server error page
 */
exports.renderServerError = function (req, res) {
  res.status(500).render('modules/core/server/views/500', {
    error: 'Oops! Something went wrong...'
  });
};

/**
 * Render the server not found responses
 * Performs content-negotiation on the Accept HTTP header
 */
exports.renderNotFound = function (req, res) {

  res.status(404).format({
    'text/html': function () {
      res.render('modules/core/server/views/404', {
        url: req.originalUrl
      });
    },
    'application/json': function () {
      res.json({
        error: 'Path not found'
      });
    },
    'default': function () {
      res.send('Path not found');
    }
  });
};

/**
 * Send an email when the contact from is submitted
 */
exports.sendMail = function(req, res) {

    var data = req.body;

    /*
      'data' has the following properties
      - contactEmail : email address
      - subject : subject line
      - text : Message to write to the user
      - sendSlideDeck : boolean whether or not to send the slide deck
    */ 


    /*
      REMOVE!

      Eventually this should be:
      
      var mailOptions = {
        from: config.mailer.from,
        to: data.contactEmail
        subject: data.subject
        text: data.text   
      }

      if(data.sendSlideDeck)
      {
        mailOptions.attachements = ...
      }

    */
    var mailOptions = {
        from: "cen3031_3a_f17@mail.com",
        to: data.contactEmail, // list of receivers
        subject: data.subject
        text: data.text
    }

    // send mail with defined transport object
    transporter.sendMail(mailOptions, function(error, response){
        if(error){
            console.log(error);
        }else{
            console.log("Message sent: " + response.message);
        }
    });
    

    res.json(data);
};