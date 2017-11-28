(function () {
  'use strict';

  angular
    .module('hometexts.admin')
    .controller('HometextsAdminController', HometextsAdminController);

  HometextsAdminController.$inject = ['$scope', '$state', '$window', 'hometextResolve', 'Authentication', 'Notification'];

  function HometextsAdminController($scope, $state, $window, hometext, Authentication, Notification) {
    var vm = this;

    vm.hometext = hometext;
    vm.authentication = Authentication;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Hometext
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.hometext.$remove(function () {
          $state.go('admin.hometext.list');
          Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Hometext deleted successfully!' });
        });
      }
    }

    // Save Hometext
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.hometextForm');
        return false;
      }

      // Create a new hometext, or update the current instance
      vm.hometext.createOrUpdate()
        .then(successCallback)
        .catch(errorCallback);

      function successCallback(res) {
        $state.go('admin.hometext.list'); // should we send the User to the list or the updated Hometext's view?
        Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Hometext saved successfully!' });
      }

      function errorCallback(res) {
        Notification.error({ message: res.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Hometext save error!' });
      }
    }
  }
}());
