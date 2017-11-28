(function () {
  'use strict';

  // Configuring the Abouttext Admin module
  angular
    .module('abouttexts.admin')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(Menus) {
    Menus.addSubMenuItem('topbar', 'admin', {
      title: 'Manage Abouttext',
      state: 'admin.abouttext.list'
    });
  }
}());
