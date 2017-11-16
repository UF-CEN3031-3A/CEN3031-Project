(function () {
  'use strict';

  angular
    .module('core')
    .controller('AboutUsController', AboutUsController);

  AboutUsController.$inject = ['SlideDeckModalService'];

  function AboutUsController(SlideDeckModalService) {
    var vm = this;
    vm.data = {};

    this.slideDeckModal = function () {
      SlideDeckModalService.showModal({});
    };
  }

}());
