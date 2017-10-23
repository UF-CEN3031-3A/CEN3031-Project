(function () {
  'use strict';

  angular
    .module('faqs.admin')
    .controller('FaqsAdminController', FaqsAdminController);

  FaqsAdminController.$inject = ['$scope', '$state', '$window', 'faqResolve', 'Authentication', 'Notification'];

  function FaqsAdminController($scope, $state, $window, faq, Authentication, Notification) {
    var vm = this;

    vm.faq = faq;
    vm.authentication = Authentication;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Faq
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.faq.$remove(function () {
          $state.go('admin.faqs.list');
          Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Faq deleted successfully!' });
        });
      }
    }

    // Save Faq
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.faqForm');
        return false;
      }

      // Create a new faq, or update the current instance
      vm.faq.createOrUpdate()
        .then(successCallback)
        .catch(errorCallback);

      function successCallback(res) {
        $state.go('admin.faqs.list'); // should we send the User to the list or the updated Faq's view?
        Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Faq saved successfully!' });
      }

      function errorCallback(res) {
        Notification.error({ message: res.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Faq save error!' });
      }
    }
  }
}());
