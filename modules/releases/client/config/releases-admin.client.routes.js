(function () {
  'use strict';

  angular
    .module('releases.admin.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('admin.releases', {
        abstract: true,
        url: '/releases',
        template: '<ui-view/>'
      })
      .state('admin.releases.list', {
        url: '',
        templateUrl: '/modules/releases/client/views/admin/list-releases.client.view.html',
        controller: 'ReleasesAdminListController',
        controllerAs: 'vm',
        data: {
          roles: ['admin']
        }
      })
      .state('admin.releases.create', {
        url: '/create',
        templateUrl: '/modules/releases/client/views/admin/form-release.client.view.html',
        controller: 'ReleasesAdminController',
        controllerAs: 'vm',
        data: {
          roles: ['admin']
        },
        resolve: {
          releaseResolve: newRelease
        }
      })
      .state('admin.releases.edit', {
        url: '/:releaseId/edit',
        templateUrl: '/modules/releases/client/views/admin/form-release.client.view.html',
        controller: 'ReleasesAdminController',
        controllerAs: 'vm',
        data: {
          roles: ['admin'],
          pageTitle: '{{ releaseResolve.title }}'
        },
        resolve: {
          releaseResolve: getRelease
        }
      });
  }

  getRelease.$inject = ['$stateParams', 'ReleasesService'];

  function getRelease($stateParams, ReleasesService) {
    return ReleasesService.get({
      releaseId: $stateParams.releaseId
    }).$promise;
  }

  newRelease.$inject = ['ReleasesService'];

  function newRelease(ReleasesService) {
    return new ReleasesService();
  }
}());
