(function() {
    'use strict';

    angular.module('core').controller('ContactUsController', ContactUsController);

    function ContactUsController($scope)
    {
        var vm = this;

        $scope.oneAtATime = false;

        $scope.groups = [
            {title: 'FAQ 1', content: 'Dynamic Group Body - 1'},
            {title: 'FAQ 2', content: 'Dynamic Group Body - 2'}
        ];

        $scope.status = {isCustomHeaderOpen: false, isFirstOpen: true, isFirstDisabled: false};
    }

}());
