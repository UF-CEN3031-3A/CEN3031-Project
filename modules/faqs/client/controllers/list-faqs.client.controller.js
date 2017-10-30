(function () {
  'use strict';

  angular
    .module('faqs')
    .controller('FaqsListController', FaqsListController);

  FaqsListController.$inject = ['FaqsService'];

  function FaqsListController(FaqsService) {
    var vm = this;

    vm.faqs = FaqsService.query();

    vm.oneAtATime = false;

    vm.status = {
      isCustomHeaderOpen: false,
      isFirstOpen: true,
      isFirstDisabled: false
    };


  }
}());
