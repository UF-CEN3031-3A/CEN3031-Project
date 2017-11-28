(function () {
  'use strict';

  angular
    .module('abouts')
    .controller('AboutsListController', AboutsListController);

  AboutsListController.$inject = ['AboutsService', 'AbouttextsService'];

  function AboutsListController(AboutsService, AbouttextsService) {
    var vm = this;

    vm.abouts = AboutsService.query();

    vm.abouttext = AbouttextsService.query();
  }
}());
