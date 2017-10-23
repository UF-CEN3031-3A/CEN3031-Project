(function () {
  'use strict';

  angular
    .module('faqs.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('faqs', {
        abstract: true,
        url: '/faqs',
        template: '<ui-view/>'
      })
      .state('faqs.list', {
        url: '',
        templateUrl: '/modules/faqs/client/views/list-faqs.client.view.html',
        controller: 'FaqsListController',
        controllerAs: 'vm'
      })
      .state('faqs.view', {
        url: '/:faqId',
        templateUrl: '/modules/faqs/client/views/view-faq.client.view.html',
        controller: 'FaqsController',
        controllerAs: 'vm',
        resolve: {
          faqResolve: getFaq
        },
        data: {
          pageTitle: '{{ faqResolve.title }}'
        }
      });
  }

  getFaq.$inject = ['$stateParams', 'FaqsService'];

  function getFaq($stateParams, FaqsService) {
    return FaqsService.get({
      faqId: $stateParams.faqId
    }).$promise;
  }
}());
