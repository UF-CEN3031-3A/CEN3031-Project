(function () {
  'use strict';

  angular
    .module('faqs')
    .controller('FaqsController', FaqsController);

  FaqsController.$inject = ['$scope', 'faqResolve', 'Authentication'];

  function FaqsController($scope, faq, Authentication) {
    var vm = this;

    vm.faq = faq;
    vm.authentication = Authentication;

  }
}());
