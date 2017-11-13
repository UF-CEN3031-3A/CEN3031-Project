(function () {
  'use strict';

  angular
    .module('abouts.admin')
    .controller('AboutsAdminController', AboutsAdminController);

  AboutsAdminController.$inject = ['$scope', '$state', '$window', 'aboutResolve', 'Authentication', 'Notification'];

  function AboutsAdminController($scope, $state, $window, about, Authentication, Notification) {
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

/*
      $scope.uploadedFile = function () {
        var f = document.getElementById('file').files[0];
        var r = new FileReader();
        r.onloadend = function (e) {
          var data = e.target.result;
        };
        console.log()
        r.readAsBinaryString(f);
      };

      console.log($scope.uploadedFile);
*/
/*
      console.log("about to convert to base64")
      var reader = new FileReader();
      reader.onloadend = function () {
        vm.about.image = reader.result;
        console.log("IMAGE");
        console.log(vm.about.image);
      };
*/
      /*
      function updateAboutWithBase64Image() {
        // encode as base 64
        var reader = new FileReader();
        reader.onloadend = function () {
          vm.about.image = reader.result;
          var user = new UsersService(vm.user);
          about.$update(function (response) {
            Authentication.user = response;
          }, function (response) {
            // do nada
          });
        };
        reader.readAsDataURL($scope.picFile);
      }
      */

      // Create a new about, or update the current instance
      vm.about.createOrUpdate()
        .then(successCallback)
        .catch(errorCallback);

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
