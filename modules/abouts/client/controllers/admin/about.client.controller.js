(function () {
  'use strict';

  angular
    .module('abouts.admin')
    .controller('AboutsAdminController', AboutsAdminController);

  AboutsAdminController.$inject = ['$scope', '$state', '$window', 'aboutResolve', 'Authentication', 'Notification', 'Upload'];

  function AboutsAdminController($scope, $state, $window, about, Authentication, Notification, Upload) {
    var vm = this;

    vm.about = about;
    vm.authentication = Authentication;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing About
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.about.$remove(function () {
          $state.go('admin.abouts.list');
          Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> About deleted successfully!' });
        });
      }
    }

    // Save About
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.aboutForm');
        return false;
      }

      var uploadedImageBase64 = null;
      $scope.uploadImage = function (file) {
        if (file) {
          Upload.base64DataUrl(file).then(
            function (url) {
              // console.log(url);
              vm.about.image = url;
              vm.about.createOrUpdate()
                .then(successCallback)
                .catch(errorCallback);
            }
          );
        } else {
          vm.about.createOrUpdate()
            .then(successCallback)
            .catch(errorCallback);
        }
      };

      // Create a new about, or update the current instance
      $scope.uploadImage(vm.about.image);

      function successCallback(res) {
        $state.go('admin.abouts.list'); // should we send the User to the list or the updated About's view?
        Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> About saved successfully!' });
      }

      function errorCallback(res) {
        Notification.error({ message: res.data.message, title: '<i class="glyphicon glyphicon-remove"></i> About save error!' });
      }
    }
  }
}());
