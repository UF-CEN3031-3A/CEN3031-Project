(function () {
  'use strict';

  angular
    .module('blogtexts.services')
    .factory('BlogtextsService', BlogtextsService);

  BlogtextsService.$inject = ['$resource', '$log'];

  function BlogtextsService($resource, $log) {
    var Blogtext = $resource('/api/blogtexts/:blogtextId', {
      blogtextId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });

    angular.extend(Blogtext.prototype, {
      createOrUpdate: function () {
        var blogtext = this;
        return createOrUpdate(blogtext);
      }
    });

    return Blogtext;

    function createOrUpdate(blogtext) {
      if (blogtext._id) {
        return blogtext.$update(onSuccess, onError);
      } else {
        return blogtext.$save(onSuccess, onError);
      }

      // Handle successful response
      function onSuccess(blogtext) {
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
