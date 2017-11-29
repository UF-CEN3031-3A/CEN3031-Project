(function () {
  'use strict';

  // Configuring the Blogtext Admin module
  angular
    .module('blogtexts.admin')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(Menus) {
    Menus.addSubMenuItem('topbar', 'admin', {
      title: 'Manage Blogtext',
      state: 'admin.blogtext.list'
    });
  }
}());
