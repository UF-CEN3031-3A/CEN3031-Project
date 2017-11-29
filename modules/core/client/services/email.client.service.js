(function () {
  'use strict';

  var module = angular.module('core');

  module.factory('EmailService', EmailService);

  EmailService.$inject = ['$http', 'Notification'];

  var admin_email = 'tess.bianchi@yahoo.com';

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
        email_data.contactEmail = admin_email;
        email_data.subject = 'Public Inquiry from ' + data.contactName;
        email_data.text = 'Name: ' + data.contactName + '\n' +
                            'Email: ' + data.contactEmail + '\n' +
                            'Message: ' + data.contactMsg + '\n';
        email_data.sendSlideDeck = false;
        send_with_feedback(email_data);

      } else if (data.type === 'business') {
        email_data.contactEmail = admin_email;
        email_data.subject = 'Business Inquiry from ' + data.contactName;
        email_data.text = 'Name: ' + data.contactName + '\n' +
                            'Company Name: ' + data.companyName + '\n' +
                            'Email: ' + data.contactEmail + '\n' +
                            'Message: ' + data.contactMsg + '\n';
        email_data.sendSlideDeck = false;
        send_with_feedback(email_data);

      } else if (data.type === 'slide_deck') {
        var email_data_admin = {};
        email_data_admin.contactEmail = admin_email;
        email_data_admin.subject = 'Slide Deck Inquiry from ' + data.contactName;
        email_data_admin.text = 'Name: ' + data.contactName + '\n' +
                            'Email: ' + data.contactEmail + '\n';
        email_data_admin.sendSlideDeck = false;
        send(email_data_admin);

        var email_data_user = {};
        email_data_user.contactEmail = data.contactEmail;
        email_data_user.subject = 'Additional info on t*Rez';
        email_data_user.text = 'Thank you for taking interest in t*Rez! Here is the information you requested.';

        email_data_user.sendSlideDeck = true;
        send_with_feedback(email_data_user);

      }
    };
    return this;
  }

}());

