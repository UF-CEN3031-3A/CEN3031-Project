(function () {
  'use strict';

  angular
    .module('publictexts.admin')
    .controller('PublictextsAdminListController', PublictextsAdminListController);

  PublictextsAdminListController.$inject = ['PublictextsService'];

  function PublictextsAdminListController(PublictextsService) {
    var vm = this;

    vm.publictexts = PublictextsService.query();
  }
}());
