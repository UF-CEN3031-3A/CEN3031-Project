(function () {
  'use strict';

  angular
    .module('abouts.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('abouts', {
        abstract: true,
        url: '/abouts',
        template: '<ui-view/>'
      })
      .state('abouts.list', {
        url: '',
        templateUrl: '/modules/abouts/client/views/list-abouts.client.view.html',
        controller: 'AboutsListController',
        controllerAs: 'vm'
      })
      .state('abouts.view', {
        url: '/:aboutId',
        templateUrl: '/modules/abouts/client/views/view-about.client.view.html',
        controller: 'AboutsController',
        controllerAs: 'vm',
        resolve: {
          aboutResolve: getAbout
        },
        data: {
          pageTitle: '{{ aboutResolve.title }}'
        }
      });
  }

  getAbout.$inject = ['$stateParams', 'AboutsService'];

  function getAbout($stateParams, AboutsService) {
    return AboutsService.get({
      aboutId: $stateParams.aboutId
    }).$promise;
  }
}());
