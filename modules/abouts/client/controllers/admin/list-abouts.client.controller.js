(function () {
  'use strict';

  angular
    .module('abouts.admin')
    .controller('AboutsAdminListController', AboutsAdminListController);

  AboutsAdminListController.$inject = ['AboutsService'];

  function AboutsAdminListController(AboutsService) {
    var vm = this;

    vm.abouts = AboutsService.query();
  }
}());
