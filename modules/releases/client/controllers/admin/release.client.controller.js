(function () {
  'use strict';

  angular
    .module('releases.admin')
    .controller('ReleasesAdminController', ReleasesAdminController);

  ReleasesAdminController.$inject = ['$scope', '$state', '$window', 'releaseResolve', 'Authentication', 'Notification'];

  function ReleasesAdminController($scope, $state, $window, release, Authentication, Notification) {
    var vm = this;

    vm.release = release;
    vm.authentication = Authentication;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Release
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.release.$remove(function () {
          $state.go('admin.releases.list');
          Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Release deleted successfully!' });
        });
      }
    }

    // Save Release
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.releaseForm');
        return false;
      }

      // Create a new release, or update the current instance
      vm.release.createOrUpdate()
        .then(successCallback)
        .catch(errorCallback);

      function successCallback(res) {
        $state.go('admin.releases.list'); // should we send the User to the list or the updated Release's view?
        Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Release saved successfully!' });
      }

      function errorCallback(res) {
        Notification.error({ message: res.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Release save error!' });
      }
    }
  }
}());
