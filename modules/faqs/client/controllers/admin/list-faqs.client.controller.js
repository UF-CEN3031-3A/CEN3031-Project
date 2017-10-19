(function () {
  'use strict';

  angular
    .module('faqs.admin')
    .controller('FaqsAdminListController', FaqsAdminListController);

  FaqsAdminListController.$inject = ['FaqsService'];

  function FaqsAdminListController(FaqsService) {
    var vm = this;

    vm.faqs = FaqsService.query();
  }
}());
