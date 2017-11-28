(function () {
  'use strict';

  angular
    .module('abouttexts.admin')
    .controller('AbouttextsAdminController', AbouttextsAdminController);

  AbouttextsAdminController.$inject = ['$scope', '$state', '$window', 'abouttextResolve', 'Authentication', 'Notification'];

  function AbouttextsAdminController($scope, $state, $window, abouttext, Authentication, Notification) {
    var vm = this;

    vm.abouttext = abouttext;
    vm.authentication = Authentication;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Abouttext
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.abouttext.$remove(function () {
          $state.go('admin.abouttext.list');
          Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Abouttext deleted successfully!' });
        });
      }
    }

    // Save Abouttext
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.abouttextForm');
        return false;
      }

      // Create a new abouttext, or update the current instance
      vm.abouttext.createOrUpdate()
        .then(successCallback)
        .catch(errorCallback);

      function successCallback(res) {
        $state.go('admin.abouttext.list'); // should we send the User to the list or the updated Abouttext's view?
        Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Abouttext saved successfully!' });
      }

      function errorCallback(res) {
        Notification.error({ message: res.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Abouttext save error!' });
      }
    }
  }
}());
