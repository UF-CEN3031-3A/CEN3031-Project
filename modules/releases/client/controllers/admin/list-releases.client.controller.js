(function () {
  'use strict';

  angular
    .module('releases.admin')
    .controller('ReleasesAdminListController', ReleasesAdminListController);

  ReleasesAdminListController.$inject = ['ReleasesService'];

  function ReleasesAdminListController(ReleasesService) {
    var vm = this;

    vm.releases = ReleasesService.query();
  }
}());
