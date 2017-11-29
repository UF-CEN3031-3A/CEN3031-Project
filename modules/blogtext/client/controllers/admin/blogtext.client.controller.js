(function () {
  'use strict';

  angular
    .module('blogtexts.admin')
    .controller('BlogtextsAdminController', BlogtextsAdminController);

  BlogtextsAdminController.$inject = ['$scope', '$state', '$window', 'blogtextResolve', 'Authentication', 'Notification'];

  function BlogtextsAdminController($scope, $state, $window, blogtext, Authentication, Notification) {
    var vm = this;

    vm.blogtext = blogtext;
    vm.authentication = Authentication;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Blogtext
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.blogtext.$remove(function () {
          $state.go('admin.blogtext.list');
          Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Blogtext deleted successfully!' });
        });
      }
    }

    // Save Blogtext
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.blogtextForm');
        return false;
      }

      // Create a new blogtext, or update the current instance
      vm.blogtext.createOrUpdate()
        .then(successCallback)
        .catch(errorCallback);

      function successCallback(res) {
        $state.go('admin.blogtext.list'); // should we send the User to the list or the updated Blogtext's view?
        Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Blogtext saved successfully!' });
      }

      function errorCallback(res) {
        Notification.error({ message: res.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Blogtext save error!' });
      }
    }
  }
}());
