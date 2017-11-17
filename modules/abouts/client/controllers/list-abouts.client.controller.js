(function () {
  'use strict';

  angular
    .module('abouts')
    .controller('AboutsListController', AboutsListController);

  AboutsListController.$inject = ['AboutsService'];

  function AboutsListController(AboutsService) {
    var vm = this;

    vm.abouts = AboutsService.query();
  }
}());
