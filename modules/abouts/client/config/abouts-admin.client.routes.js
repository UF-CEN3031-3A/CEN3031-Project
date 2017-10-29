(function () {
  'use strict';

  angular
    .module('abouts.admin.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('admin.abouts', {
        abstract: true,
        url: '/abouts',
        template: '<ui-view/>'
      })
      .state('admin.abouts.list', {
        url: '',
        templateUrl: '/modules/abouts/client/views/admin/list-abouts.client.view.html',
        controller: 'AboutsAdminListController',
        controllerAs: 'vm',
        data: {
          roles: ['admin']
        }
      })
      .state('admin.abouts.create', {
        url: '/create',
        templateUrl: '/modules/abouts/client/views/admin/form-about.client.view.html',
        controller: 'AboutsAdminController',
        controllerAs: 'vm',
        data: {
          roles: ['admin']
        },
        resolve: {
          aboutResolve: newAbout
        }
      })
      .state('admin.abouts.edit', {
        url: '/:aboutId/edit',
        templateUrl: '/modules/abouts/client/views/admin/form-about.client.view.html',
        controller: 'AboutsAdminController',
        controllerAs: 'vm',
        data: {
          roles: ['admin'],
          pageTitle: '{{ aboutResolve.title }}'
        },
        resolve: {
          aboutResolve: getAbout
        }
      });
  }

  getAbout.$inject = ['$stateParams', 'AboutsService'];

  function getAbout($stateParams, AboutsService) {
    return AboutsService.get({
      aboutId: $stateParams.aboutId
    }).$promise;
  }

  newAbout.$inject = ['AboutsService'];

  function newAbout(AboutsService) {
    return new AboutsService();
  }
}());
