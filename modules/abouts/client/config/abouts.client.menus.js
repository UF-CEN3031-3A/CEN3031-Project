(function () {
  'use strict';

  angular
    .module('abouts')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    menuService.addMenuItem('topbar', {
      title: 'Abouts',
      state: 'abouts',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'abouts', {
      title: 'List Abouts',
      state: 'abouts.list',
      roles: ['*']
    });
  }
}());
