(function () {
  'use strict';

  angular
    .module('blogtexts.admin')
    .controller('BlogtextsAdminListController', BlogtextsAdminListController);

  BlogtextsAdminListController.$inject = ['BlogtextsService'];

  function BlogtextsAdminListController(BlogtextsService) {
    var vm = this;

    vm.blogtexts = BlogtextsService.query();
  }
}());
