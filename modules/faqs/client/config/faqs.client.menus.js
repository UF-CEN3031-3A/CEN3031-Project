(function () {
  'use strict';

  angular
    .module('faqs')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    menuService.addMenuItem('topbar', {
      title: 'Faqs',
      state: 'faqs',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'faqs', {
      title: 'List Faqs',
      state: 'faqs.list',
      roles: ['*']
    });
  }
}());
