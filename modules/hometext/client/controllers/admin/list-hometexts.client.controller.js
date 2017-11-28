(function () {
  'use strict';

  angular
    .module('hometexts.admin')
    .controller('HometextsAdminListController', HometextsAdminListController);

  HometextsAdminListController.$inject = ['HometextsService'];

  function HometextsAdminListController(HometextsService) {
    var vm = this;

    vm.hometexts = HometextsService.query();
  }
}());
