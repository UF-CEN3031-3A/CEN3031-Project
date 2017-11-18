(function () {
  'use strict';

  angular
    .module('core')
    .controller('HomeControll', HomeControll);

  function HomeControll($scope) {

    var vm = this;

    $scope.oneAtATime = false;

    $scope.status = { isCustomHeaderOpen: false, isFirstOpen: true, isFirstDisabled: false };
  }
}());
