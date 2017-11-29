'use strict';

var validator = require('validator'),
  path = require('path'),
  config = require(path.resolve('./config/config')),
  nodemailer = require('nodemailer'),
  base64 = require('file-base64');

const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

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
exports.sendMail = function (req, res) {

  var data = req.body;

  console.log('MSG:');

  /*
    'data' has the following properties
    - contactEmail : email address
    - subject : subject line
    - text : Message to write to the user
    - sendSlideDeck : boolean whether or not to send the slide deck
  */

  if (data.contactEmail === 'admin_email') {
    data.contactEmail = process.env.MAILER_ADMIN_EMAIL;
  }

  if (data.sendSlideDeck) {
    base64.encode('modules/core/client/img/pitch_deck.pdf', function (err, base64String) {
      if (err) {
        console.log(err);
      } else {
        console.log('success encoding pdf!');
        const msg = {
          to: data.contactEmail,
          from: process.env.MAILER_FROM,
          subject: data.subject,
          html: data.text
        };
        console.log(msg);
        msg.attachments = [
          {
            filename: 'pitch_deck.pdf',
            content: base64String,
            contentType: 'application/pdf'
          }];
        console.log('sending pdf!');
        sgMail.send(msg);
        res.json(data);
      }
    });


  } else {
    const msg = {
      to: data.contactEmail,
      from: process.env.MAILER_FROM,
      subject: data.subject,
      html: data.text
    };
    console.log(msg);
    sgMail.send(msg);
    res.json(data);
  }


};
