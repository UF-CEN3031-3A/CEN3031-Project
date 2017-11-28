// (function () {
//   'use strict';

//   angular
//     .module('releases')
//     .run(menuConfig);

//   menuConfig.$inject = ['menuService'];

//   function menuConfig(menuService) {
//     menuService.addMenuItem('topbar', {
//       title: 'Releases',
//       state: 'releases',
//       type: 'dropdown',
//       roles: ['*']
//     });

//     // Add the dropdown list item
//     menuService.addSubMenuItem('topbar', 'releases', {
//       title: 'List Releases',
//       state: 'releases.list',
//       roles: ['*']
//     });
//   }
// }());
