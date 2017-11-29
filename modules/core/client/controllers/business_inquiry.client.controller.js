(function () {
  'use strict';

  angular
    .module('core')
    .controller('BusinessInquiryController', BusinessInquiryController);

  BusinessInquiryController.$inject = ['BusinesstextsService', '$http', 'EmailService', 'SlideDeckModalService'];

  function BusinessInquiryController(BusinesstextsService, $http, EmailService, SlideDeckModalService) {
    var vm = this;

    vm.businesstext = BusinesstextsService.query();

    vm.data = {};
    vm.data.type = 'business';
    this.sendMail = function () {
      EmailService.email(vm.data);
    };

    this.slideDeckModal = function () {
      SlideDeckModalService.showModal({});
    };
  }

}());
