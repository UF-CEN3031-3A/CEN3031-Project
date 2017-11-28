(function () {
  'use strict';

  angular
    .module('hometexts.admin.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('admin.hometext', {
        abstract: true,
        url: '/hometext',
        template: '<ui-view/>'
      })
      .state('admin.hometext.list', {
        url: '',
        templateUrl: '/modules/hometext/client/views/admin/list-hometexts.client.view.html',
        controller: 'HometextsAdminListController',
        controllerAs: 'vm',
        data: {
          roles: ['admin']
        }
      })
      .state('admin.hometext.create', {
        url: '/create',
        templateUrl: '/modules/hometext/client/views/admin/form-hometext.client.view.html',
        controller: 'HometextsAdminController',
        controllerAs: 'vm',
        data: {
          roles: ['admin']
        },
        resolve: {
          hometextResolve: newHometext
        }
      })
      .state('admin.hometext.edit', {
        url: '/:hometextId/edit',
        templateUrl: '/modules/hometext/client/views/admin/form-hometext.client.view.html',
        controller: 'HometextsAdminController',
        controllerAs: 'vm',
        data: {
          roles: ['admin'],
          pageTitle: '{{ hometextResolve.title }}'
        },
        resolve: {
          hometextResolve: getHometext
        }
      });
  }

  getHometext.$inject = ['$stateParams', 'HometextsService'];

  function getHometext($stateParams, HometextsService) {
    return HometextsService.get({
      hometextId: $stateParams.hometextId
    }).$promise;
  }

  newHometext.$inject = ['HometextsService'];

  function newHometext(HometextsService) {
    return new HometextsService();
  }
}());
