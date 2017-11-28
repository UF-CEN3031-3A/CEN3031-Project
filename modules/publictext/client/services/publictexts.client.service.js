(function () {
  'use strict';

  angular
    .module('publictexts.services')
    .factory('PublictextsService', PublictextsService);

  PublictextsService.$inject = ['$resource', '$log'];

  function PublictextsService($resource, $log) {
    var Publictext = $resource('/api/publictexts/:publictextId', {
      publictextId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });

    angular.extend(Publictext.prototype, {
      createOrUpdate: function () {
        var publictext = this;
        return createOrUpdate(publictext);
      }
    });

    return Publictext;

    function createOrUpdate(publictext) {
      if (publictext._id) {
        return publictext.$update(onSuccess, onError);
      } else {
        return publictext.$save(onSuccess, onError);
      }

      // Handle successful response
      function onSuccess(publictext) {
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
