(function () {
  'use strict';

 angular
    .module('core')
    .controller('ModalController', ModalController);

  ModalController.$inject = ['$uibModalInstance', 'EmailService'];

  function ModalController($uibModalInstance, EmailService) {
    var vm = this;
    vm.data = {};
    vm.data.type = "slide_deck"

    this.send_mail = function()
    {
      EmailService(vm.data);
      $uibModalInstance.close();
    }
  }

angular.module('core')
.service('SlideDeckModalService', ['$uibModal',
    function ($uibModal) {
      var modalDefaults = {
          controller: "ModalController",
          controllerAs: 'vm',
          keyboard: true,
          modalFade: true,
          templateUrl: '/modules/core/client/views/partials/slide-deck-modal.client.view.html'
      };

      this.showModal = function (customModalDefaults) {
          if (!customModalDefaults) customModalDefaults = {};
          return this.show(customModalDefaults);
      };

      this.show = function (customModalDefaults) {
          //Create temp objects to work with since we're in a singleton service
          var tempModalDefaults = {};

          //Map angular-ui modal custom defaults to modal defaults defined in service
          angular.extend(tempModalDefaults, modalDefaults, customModalDefaults);

          return $uibModal.open(tempModalDefaults).result;
      };

}]);

}());