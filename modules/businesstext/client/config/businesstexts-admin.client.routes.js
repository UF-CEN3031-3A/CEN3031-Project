(function () {
  'use strict';

  angular
    .module('businesstexts.admin.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('admin.businesstext', {
        abstract: true,
        url: '/businesstext',
        template: '<ui-view/>'
      })
      .state('admin.businesstext.list', {
        url: '',
        templateUrl: '/modules/businesstext/client/views/admin/list-businesstexts.client.view.html',
        controller: 'BusinesstextsAdminListController',
        controllerAs: 'vm',
        data: {
          roles: ['admin']
        }
      })
      .state('admin.businesstext.create', {
        url: '/create',
        templateUrl: '/modules/businesstext/client/views/admin/form-businesstext.client.view.html',
        controller: 'BusinesstextsAdminController',
        controllerAs: 'vm',
        data: {
          roles: ['admin']
        },
        resolve: {
          businesstextResolve: newBusinesstext
        }
      })
      .state('admin.businesstext.edit', {
        url: '/:businesstextId/edit',
        templateUrl: '/modules/businesstext/client/views/admin/form-businesstext.client.view.html',
        controller: 'BusinesstextsAdminController',
        controllerAs: 'vm',
        data: {
          roles: ['admin'],
          pageTitle: '{{ businesstextResolve.title }}'
        },
        resolve: {
          businesstextResolve: getBusinesstext
        }
      });
  }

  getBusinesstext.$inject = ['$stateParams', 'BusinesstextsService'];

  function getBusinesstext($stateParams, BusinesstextsService) {
    return BusinesstextsService.get({
      businesstextId: $stateParams.businesstextId
    }).$promise;
  }

  newBusinesstext.$inject = ['BusinesstextsService'];

  function newBusinesstext(BusinesstextsService) {
    return new BusinesstextsService();
  }
}());
