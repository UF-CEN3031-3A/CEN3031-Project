(function () {
  'use strict';

  angular
    .module('publictexts.admin.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('admin.publictext', {
        abstract: true,
        url: '/publictext',
        template: '<ui-view/>'
      })
      .state('admin.publictext.list', {
        url: '',
        templateUrl: '/modules/publictext/client/views/admin/list-publictexts.client.view.html',
        controller: 'PublictextsAdminListController',
        controllerAs: 'vm',
        data: {
          roles: ['admin']
        }
      })
      .state('admin.publictext.create', {
        url: '/create',
        templateUrl: '/modules/publictext/client/views/admin/form-publictext.client.view.html',
        controller: 'PublictextsAdminController',
        controllerAs: 'vm',
        data: {
          roles: ['admin']
        },
        resolve: {
          publictextResolve: newPublictext
        }
      })
      .state('admin.publictext.edit', {
        url: '/:publictextId/edit',
        templateUrl: '/modules/publictext/client/views/admin/form-publictext.client.view.html',
        controller: 'PublictextsAdminController',
        controllerAs: 'vm',
        data: {
          roles: ['admin'],
          pageTitle: '{{ publictextResolve.title }}'
        },
        resolve: {
          publictextResolve: getPublictext
        }
      });
  }

  getPublictext.$inject = ['$stateParams', 'PublictextsService'];

  function getPublictext($stateParams, PublictextsService) {
    return PublictextsService.get({
      publictextId: $stateParams.publictextId
    }).$promise;
  }

  newPublictext.$inject = ['PublictextsService'];

  function newPublictext(PublictextsService) {
    return new PublictextsService();
  }
}());
