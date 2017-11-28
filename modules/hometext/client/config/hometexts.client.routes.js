// (function () {
//   'use strict';

//   angular
//     .module('releases.routes')
//     .config(routeConfig);

//   routeConfig.$inject = ['$stateProvider'];

//   function routeConfig($stateProvider) {
//     $stateProvider
//       .state('releases', {
//         abstract: true,
//         url: '/releases',
//         template: '<ui-view/>'
//       })
//       .state('releases.list', {
//         url: '',
//         templateUrl: '/modules/releases/client/views/list-releases.client.view.html',
//         controller: 'ReleasesListController',
//         controllerAs: 'vm'
//       })
//       .state('releases.view', {
//         url: '/:releaseId',
//         templateUrl: '/modules/releases/client/views/view-release.client.view.html',
//         controller: 'ReleasesController',
//         controllerAs: 'vm',
//         resolve: {
//           releaseResolve: getRelease
//         },
//         data: {
//           pageTitle: '{{ releaseResolve.title }}'
//         }
//       });
//   }

//   getRelease.$inject = ['$stateParams', 'ReleasesService'];

//   function getRelease($stateParams, ReleasesService) {
//     return ReleasesService.get({
//       releaseId: $stateParams.releaseId
//     }).$promise;
//   }
// }());
