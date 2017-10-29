(function () {
  'use strict';

  angular
    .module('abouts')
    .controller('AboutsController', AboutsController);

  AboutsController.$inject = ['$scope', 'aboutResolve', 'Authentication'];

  function AboutsController($scope, about, Authentication) {
    var vm = this;

    vm.about = about;
    vm.authentication = Authentication;

  }
}());
