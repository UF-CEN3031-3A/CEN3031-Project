(function () {
  'use strict';

  // Configuring the Publictext Admin module
  angular
    .module('publictexts.admin')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(Menus) {
    Menus.addSubMenuItem('topbar', 'admin', {
      title: 'Manage Publictext',
      state: 'admin.publictext.list'
    });
  }
}());
