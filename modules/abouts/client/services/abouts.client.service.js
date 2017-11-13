(function () {
  'use strict';

  angular
    .module('abouts.services')
    .factory('AboutsService', AboutsService);

  AboutsService.$inject = ['$resource', '$log'];

  function AboutsService($resource, $log) {
    var About = $resource('/api/abouts/:aboutId', {
      aboutId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });

    angular.extend(About.prototype, {
      createOrUpdate: function () {
        console.log(this);
        var about = this;
        return createOrUpdate(about);
      }
    });

    return About;

    function createOrUpdate(about) {
      if (about._id) {
        return about.$update(onSuccess, onError);
      } else {
        return about.$save(onSuccess, onError);
      }

      // Handle successful response
      function onSuccess(about) {
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
