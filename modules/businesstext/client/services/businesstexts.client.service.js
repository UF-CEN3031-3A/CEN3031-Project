(function () {
  'use strict';

  angular
    .module('businesstexts.services')
    .factory('BusinesstextsService', BusinesstextsService);

  BusinesstextsService.$inject = ['$resource', '$log'];

  function BusinesstextsService($resource, $log) {
    var Businesstext = $resource('/api/businesstexts/:businesstextId', {
      businesstextId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });

    angular.extend(Businesstext.prototype, {
      createOrUpdate: function () {
        var businesstext = this;
        return createOrUpdate(businesstext);
      }
    });

    return Businesstext;

    function createOrUpdate(businesstext) {
      if (businesstext._id) {
        return businesstext.$update(onSuccess, onError);
      } else {
        return businesstext.$save(onSuccess, onError);
      }

      // Handle successful response
      function onSuccess(businesstext) {
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
