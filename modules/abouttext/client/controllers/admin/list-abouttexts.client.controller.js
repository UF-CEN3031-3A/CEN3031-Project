(function () {
  'use strict';

  angular
    .module('abouttexts.admin')
    .controller('AbouttextsAdminListController', AbouttextsAdminListController);

  AbouttextsAdminListController.$inject = ['AbouttextsService'];

  function AbouttextsAdminListController(AbouttextsService) {
    var vm = this;

    vm.abouttexts = AbouttextsService.query();
  }
}());
