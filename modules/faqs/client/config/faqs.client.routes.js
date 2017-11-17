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
        url: '/contact_us',
        template: '<ui-view/>'
      })
      .state('faqs.list', {
        url: '',
        templateUrl: '/modules/faqs/client/views/list-faqs.client.view.html',
        controller: 'FaqsListController',
        controllerAs: 'vm'
      });
  }

  getFaq.$inject = ['$stateParams', 'FaqsService'];

  function getFaq($stateParams, FaqsService) {
    return FaqsService.get({
      faqId: $stateParams.faqId
    }).$promise;
  }
}());
