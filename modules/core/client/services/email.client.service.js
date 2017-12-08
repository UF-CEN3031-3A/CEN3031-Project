(function () {
  'use strict';

  var module = angular.module('core');

  module.factory('EmailService', EmailService);

  EmailService.$inject = ['$http', 'Notification'];

  function EmailService($http, Notification) {

    /*
      'data' has the following properties
      - contactEmail : email address
      - subject : subject line
      - text : Message to write to the user
      - sendSlideDeck : boolean whether or not to send the slide deck
    */
    var send = function (data) {
      $http.post('/core-contact-form', data);
    };

    var send_with_feedback = function (data) {
        // Simple POST request example (passing data) :
      $http.post('/core-contact-form', data).
            success(function (data, status, headers, config) {
              Notification.success({ message: 'Yay!', title: '<i class="glyphicon glyphicon-ok"></i> Email sent!', delay: 6000 });

            }).
            error(function (data, status, headers, config) {
              Notification.error({ message: 'Email failed to send', title: '<i class="glyphicon glyphicon-remove"></i> Email error!', delay: 6000 });
            });
    };


     /*
      'data' has the following properties
      * Requireds
      - *type: string, either public, business, slide_deck
      - *contactEmail : email address
      - *contactName : Name of the person
      - companyName : Name of the company
      - contactMsg : Message to write to the user
    */
    this.email = function (data) {

      // All email data should AT LEAST have an email address and contact name. If it doesn't. Nope. No email!
      if (!data.contactEmail || !data.contactName || (data.type !== 'business' && data.type !== 'public' & data.type !== 'slide_deck')) {
        Notification.error({ message: 'Email failed to send', title: '<i class="glyphicon glyphicon-remove"></i> Email error!', delay: 6000 });
      }

      var email_data = {};

      if (data.type === 'public') {
        email_data.contactEmail = 'admin_email';
        email_data.subject = 'Public Inquiry from ' + data.contactName;
        email_data.text = '<b>Name:</b> ' + data.contactName + '<br>' +
                          '<b>Email:</b>' + data.contactEmail + '<br>' +
                          '<b>Message:</b> ' + data.contactMsg + '<br>';
        email_data.sendSlideDeck = false;
        send_with_feedback(email_data);

      } else if (data.type === 'business') {
        email_data.contactEmail = 'admin_email';
        email_data.subject = 'Business Inquiry from ' + data.contactName;
        email_data.text = '<b>Name:</b> ' + data.contactName + '<br>' +
                          '<b>Company Name:</b> ' + data.companyName + '<br>' +
                          '<b>Email:</b> ' + data.contactEmail + '<br>' +
                          '<b>Message:</b> ' + data.contactMsg + '<br>';
        email_data.sendSlideDeck = false;
        send_with_feedback(email_data);

      } else if (data.type === 'slide_deck') {
        var email_data_admin = {};
        email_data_admin.contactEmail = 'admin_email';
        email_data_admin.subject = 'Slide Deck Inquiry from ' + data.contactName;
        email_data_admin.text = '<b>Name:</b> ' + data.contactName + '<br>' +
                                '<b>Email:</b> ' + data.contactEmail + '<br>';
        email_data_admin.sendSlideDeck = false;
        send(email_data_admin);

        var email_data_user = {};
        email_data_user.contactEmail = data.contactEmail;
        email_data_user.subject = 'Additional info on t*Rez';
        email_data_user.text = 'Hey ' + data.contactName + ',' + '<br><br>' +
                               'Thank you for your interest in Heart Healthy Spirits. Attached here is our standard information deck ' +
                               'taking a closer look at the science and the promise of our antioxidant infusion technology.' + '<br>' +
                               'If you\'d still like to learn more about the t*ReZ technology or the ongoing development of new infusion ' +
                               'products, feel free to respond to this email with your inquiry. We\'ll have someone from our team respond to you directly.' + '<br><br>' +
                               'Appreciatively,<br><br>' +
                               'The HHS Team';

        email_data_user.sendSlideDeck = true;
        send_with_feedback(email_data_user);

      }
    };
    return this;
  }

}());

