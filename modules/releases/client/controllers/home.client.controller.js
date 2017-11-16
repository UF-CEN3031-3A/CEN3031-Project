(function () {
  'use strict';

  angular
    .module('core')
    .controller('HomeController', HomeController);

  HomeController.$inject = ['ReleasesService'];

  function HomeController(ReleasesService) {

    var vm = this;

    vm.oneAtATime = false;



    vm.releases = ReleasesService.query();

    // These variables are to hold the text for the different titles and blurbs in the view
    // Once fields for them have been created in the DB, the variables can refer to those instead
    vm.bannerText = 'Just One Drop.';
    vm.ParallaxCaption1 = 'Introducing: t*Rez';
    vm.ParallaxCaption2 = 'In The News';

    //vm.testing = vm.releases[0].title;

    // vm.test = ReleasesService.query( releases,
    // {
    //   title: {$like: "press release"}
    // });




    vm.groups = [
        { title: 'Lorem Ipsum', author: 'Mr. Ipsum', content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum' },
        { title: 'Lorem Ipsum', author: 'Mr. Ipsum', content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum' }
    ];

    vm.status = {
      isCustomHeaderOpen: false, 
      isFirstOpen: true, 
      isFirstDisabled: false
    };




    /////////////


  }


  // function HomeController($scope){

  //   $scope.isNavCollapsed = true;
  //   $scope.isCollapsed = false;
  //   $scope.isCollapsedHorizontal = false;
    
  // }
}());
