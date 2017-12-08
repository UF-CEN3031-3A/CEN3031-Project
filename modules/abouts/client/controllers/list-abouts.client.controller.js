(function () {
  'use strict';

  angular
    .module('abouts')
    .controller('AboutsListController', AboutsListController);

  AboutsListController.$inject = ['AboutsService', 'AbouttextsService', 'SlideDeckModalService'];

  function AboutsListController(AboutsService, AbouttextsService, SlideDeckModalService) {
    var vm = this;

    vm.abouts = AboutsService.query();

    vm.abouttext = AbouttextsService.query();

    this.slideDeckModal = function () {
      SlideDeckModalService.showModal({});
    };

  }
}());
