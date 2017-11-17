(function () {
  'use strict';

  // Configuring the Abouts Admin module
  angular
    .module('abouts.admin')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(Menus) {
    Menus.addSubMenuItem('topbar', 'admin', {
      title: 'Manage Abouts',
      state: 'admin.abouts.list'
    });
  }
}());
