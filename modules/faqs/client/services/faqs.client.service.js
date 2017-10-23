(function () {
  'use strict';

  angular
    .module('faqs.services')
    .factory('FaqsService', FaqsService);

  FaqsService.$inject = ['$resource', '$log'];

  function FaqsService($resource, $log) {
    var Faq = $resource('/api/faqs/:faqId', {
      faqId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });

    angular.extend(Faq.prototype, {
      createOrUpdate: function () {
        var faq = this;
        return createOrUpdate(faq);
      }
    });

    return Faq;

    function createOrUpdate(faq) {
      if (faq._id) {
        return faq.$update(onSuccess, onError);
      } else {
        return faq.$save(onSuccess, onError);
      }

      // Handle successful response
      function onSuccess(faq) {
        // Any required internal processing from inside the service, goes here.
      }

      // Handle error response
      function onError(errorResponse) {
        var error = errorResponse.data;
        // Handle error internally
        handleError(error);
      }
    }

    function handleError(error) {
      // Log error
      $log.error(error);
    }
  }
}());
