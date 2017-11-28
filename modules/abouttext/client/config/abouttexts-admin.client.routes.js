(function () {
  'use strict';

  angular
    .module('abouttexts.admin.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('admin.abouttext', {
        abstract: true,
        url: '/abouttext',
        template: '<ui-view/>'
      })
      .state('admin.abouttext.list', {
        url: '',
        templateUrl: '/modules/abouttext/client/views/admin/list-abouttexts.client.view.html',
        controller: 'AbouttextsAdminListController',
        controllerAs: 'vm',
        data: {
          roles: ['admin']
        }
      })
      .state('admin.abouttext.create', {
        url: '/create',
        templateUrl: '/modules/abouttext/client/views/admin/form-abouttext.client.view.html',
        controller: 'AbouttextsAdminController',
        controllerAs: 'vm',
        data: {
          roles: ['admin']
        },
        resolve: {
          abouttextResolve: newAbouttext
        }
      })
      .state('admin.abouttext.edit', {
        url: '/:abouttextId/edit',
        templateUrl: '/modules/abouttext/client/views/admin/form-abouttext.client.view.html',
        controller: 'AbouttextsAdminController',
        controllerAs: 'vm',
        data: {
          roles: ['admin'],
          pageTitle: '{{ abouttextResolve.title }}'
        },
        resolve: {
          abouttextResolve: getAbouttext
        }
      });
  }

  getAbouttext.$inject = ['$stateParams', 'AbouttextsService'];

  function getAbouttext($stateParams, AbouttextsService) {
    return AbouttextsService.get({
      abouttextId: $stateParams.abouttextId
    }).$promise;
  }

  newAbouttext.$inject = ['AbouttextsService'];

  function newAbouttext(AbouttextsService) {
    return new AbouttextsService();
  }
}());
