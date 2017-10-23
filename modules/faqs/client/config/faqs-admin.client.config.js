(function () {
  'use strict';

  // Configuring the Faqs Admin module
  angular
    .module('faqs.admin')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(Menus) {
    Menus.addSubMenuItem('topbar', 'admin', {
      title: 'Manage Faqs',
      state: 'admin.faqs.list'
    });
  }
}());
