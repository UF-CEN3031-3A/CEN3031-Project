(function () {
  'use strict';

  angular
    .module('faqs')
    .controller('FaqsListController', FaqsListController);

  FaqsListController.$inject = ['FaqsService','PublictextsService'];

  function FaqsListController(FaqsService, PublictextsService) {
    var vm = this;

    vm.faqs = FaqsService.query();

    vm.publictext = PublictextsService.query();

    vm.oneAtATime = false;

    vm.status = {
      isCustomHeaderOpen: false,
      isFirstOpen: true,
      isFirstDisabled: false
    };


  }
}());
