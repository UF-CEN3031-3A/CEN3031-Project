(function () {
  'use strict';

  // Configuring the Businesstext Admin module
  angular
    .module('businesstexts.admin')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(Menus) {
    Menus.addSubMenuItem('topbar', 'admin', {
      title: 'Manage Businesstext',
      state: 'admin.businesstext.list'
    });
  }
}());
