(function () {
  'use strict';

  angular
    .module('releases.services')
    .factory('ReleasesService', ReleasesService);

  ReleasesService.$inject = ['$resource', '$log'];

  function ReleasesService($resource, $log) {
    var Release = $resource('/api/releases/:releaseId', {
      releaseId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });

    angular.extend(Release.prototype, {
      createOrUpdate: function () {
        var release = this;
        return createOrUpdate(release);
      }
    });

    return Release;

    function createOrUpdate(release) {
      if (release._id) {
        return release.$update(onSuccess, onError);
      } else {
        return release.$save(onSuccess, onError);
      }

      // Handle successful response
      function onSuccess(release) {
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
