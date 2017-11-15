(function () {
  'use strict';

  angular
    .module('core')
    .controller('BusinessInquiryController', BusinessInquiryController);

  BusinessInquiryController.$inject = ['$http', "EmailService", "SlideDeckModalService"];

  function BusinessInquiryController($http, EmailService, SlideDeckModalService) {
    var vm = this;
    vm.data = {};
    vm.data.type = "business";
    this.sendMail = function () {
      EmailService(vm.data);
    };

    this.slideDeckModal = function()
    {
      SlideDeckModalService.showModal({});
    }
  }

}());
