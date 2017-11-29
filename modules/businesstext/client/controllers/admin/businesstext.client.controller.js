(function () {
  'use strict';

  angular
    .module('businesstexts.admin')
    .controller('BusinesstextsAdminController', BusinesstextsAdminController);

  BusinesstextsAdminController.$inject = ['$scope', '$state', '$window', 'businesstextResolve', 'Authentication', 'Notification'];

  function BusinesstextsAdminController($scope, $state, $window, businesstext, Authentication, Notification) {
    var vm = this;

    vm.businesstext = businesstext;
    vm.authentication = Authentication;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Businesstext
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.businesstext.$remove(function () {
          $state.go('admin.businesstext.list');
          Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Businesstext deleted successfully!' });
        });
      }
    }

    // Save Businesstext
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.businesstextForm');
        return false;
      }

      // Create a new businesstext, or update the current instance
      vm.businesstext.createOrUpdate()
        .then(successCallback)
        .catch(errorCallback);

      function successCallback(res) {
        $state.go('admin.businesstext.list'); // should we send the User to the list or the updated Businesstext's view?
        Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Businesstext saved successfully!' });
      }

      function errorCallback(res) {
        Notification.error({ message: res.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Businesstext save error!' });
      }
    }
  }
}());
