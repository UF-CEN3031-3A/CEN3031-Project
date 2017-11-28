(function () {
  'use strict';

  // Configuring the Hometext Admin module
  angular
    .module('hometexts.admin')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(Menus) {
    Menus.addSubMenuItem('topbar', 'admin', {
      title: 'Manage Hometext',
      state: 'admin.hometext.list'
    });
  }
}());
