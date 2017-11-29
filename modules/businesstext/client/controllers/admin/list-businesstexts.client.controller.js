(function () {
  'use strict';

  angular
    .module('businesstexts.admin')
    .controller('BusinesstextsAdminListController', BusinesstextsAdminListController);

  BusinesstextsAdminListController.$inject = ['BusinesstextsService'];

  function BusinesstextsAdminListController(BusinesstextsService) {
    var vm = this;

    vm.businesstexts = BusinesstextsService.query();
  }
}());
