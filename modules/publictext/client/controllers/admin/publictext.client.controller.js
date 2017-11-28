(function () {
  'use strict';

  angular
    .module('publictexts.admin')
    .controller('PublictextsAdminController', PublictextsAdminController);

  PublictextsAdminController.$inject = ['$scope', '$state', '$window', 'publictextResolve', 'Authentication', 'Notification'];

  function PublictextsAdminController($scope, $state, $window, publictext, Authentication, Notification) {
    var vm = this;

    vm.publictext = publictext;
    vm.authentication = Authentication;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Publictext
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.publictext.$remove(function () {
          $state.go('admin.publictext.list');
          Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Publictext deleted successfully!' });
        });
      }
    }

    // Save Publictext
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.publictextForm');
        return false;
      }

      // Create a new publictext, or update the current instance
      vm.publictext.createOrUpdate()
        .then(successCallback)
        .catch(errorCallback);

      function successCallback(res) {
        $state.go('admin.publictext.list'); // should we send the User to the list or the updated Publictext's view?
        Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Publictext saved successfully!' });
      }

      function errorCallback(res) {
        Notification.error({ message: res.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Publictext save error!' });
      }
    }
  }
}());
