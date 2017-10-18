(function () {
  'use strict';

  // Configuring the Releases Admin module
  angular
    .module('releases.admin')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(Menus) {
    Menus.addSubMenuItem('topbar', 'admin', {
      title: 'Manage Releases',
      state: 'admin.releases.list'
    });
  }
}());
