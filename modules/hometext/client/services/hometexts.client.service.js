(function () {
  'use strict';

  angular
    .module('hometexts.services')
    .factory('HometextsService', HometextsService);

  HometextsService.$inject = ['$resource', '$log'];

  function HometextsService($resource, $log) {
    var Hometext = $resource('/api/hometexts/:hometextId', {
      hometextId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });

    angular.extend(Hometext.prototype, {
      createOrUpdate: function () {
        var hometext = this;
        return createOrUpdate(hometext);
      }
    });

    return Hometext;

    function createOrUpdate(hometext) {
      if (hometext._id) {
        return hometext.$update(onSuccess, onError);
      } else {
        return hometext.$save(onSuccess, onError);
      }

      // Handle successful response
      function onSuccess(hometext) {
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
