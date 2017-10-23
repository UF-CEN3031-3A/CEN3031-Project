(function () {
  'use strict';

  angular
    .module('faqs.admin.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('admin.faqs', {
        abstract: true,
        url: '/faqs',
        template: '<ui-view/>'
      })
      .state('admin.faqs.list', {
        url: '',
        templateUrl: '/modules/faqs/client/views/admin/list-faqs.client.view.html',
        controller: 'FaqsAdminListController',
        controllerAs: 'vm',
        data: {
          roles: ['admin']
        }
      })
      .state('admin.faqs.create', {
        url: '/create',
        templateUrl: '/modules/faqs/client/views/admin/form-faq.client.view.html',
        controller: 'FaqsAdminController',
        controllerAs: 'vm',
        data: {
          roles: ['admin']
        },
        resolve: {
          faqResolve: newFaq
        }
      })
      .state('admin.faqs.edit', {
        url: '/:faqId/edit',
        templateUrl: '/modules/faqs/client/views/admin/form-faq.client.view.html',
        controller: 'FaqsAdminController',
        controllerAs: 'vm',
        data: {
          roles: ['admin'],
          pageTitle: '{{ faqResolve.title }}'
        },
        resolve: {
          faqResolve: getFaq
        }
      });
  }

  getFaq.$inject = ['$stateParams', 'FaqsService'];

  function getFaq($stateParams, FaqsService) {
    return FaqsService.get({
      faqId: $stateParams.faqId
    }).$promise;
  }

  newFaq.$inject = ['FaqsService'];

  function newFaq(FaqsService) {
    return new FaqsService();
  }
}());
