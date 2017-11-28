(function () {
  'use strict';

  angular
    .module('abouttexts.services')
    .factory('AbouttextsService', AbouttextsService);

  AbouttextsService.$inject = ['$resource', '$log'];

  function AbouttextsService($resource, $log) {
    var Abouttext = $resource('/api/abouttexts/:abouttextId', {
      abouttextId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });

    angular.extend(Abouttext.prototype, {
      createOrUpdate: function () {
        var abouttext = this;
        return createOrUpdate(abouttext);
      }
    });

    return Abouttext;

    function createOrUpdate(abouttext) {
      if (abouttext._id) {
        return abouttext.$update(onSuccess, onError);
      } else {
        return abouttext.$save(onSuccess, onError);
      }

      // Handle successful response
      function onSuccess(abouttext) {
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
