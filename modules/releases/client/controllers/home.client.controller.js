(function () {
  'use strict';

  angular
    .module('releases')
    .controller('HomeController', HomeController);

  HomeController.$inject = ['ReleasesService'];

  function HomeController(ReleasesService) {

    var vm = this;

    vm.oneAtATime = false;

    vm.releases = ReleasesService.query();

    // Variables to hold text for different titles and blurbs in the view
    vm.bannerText = 'Just One Drop.';
    vm.ParallaxCaption1 = 'Introducing: t*Rez';
    vm.Heading1 = 'Your Next Source of Antioxidant Benefits';
    vm.Heading2 = 'Now Making its Way in to All Your Favorite Products';
    vm.mainText1 = 'This is a blurb that serves to briefly summarize the initial product video featured above, and reaffirm the impact and power of this product to bring the heart-healthy, antioxidant-based benefits of resveratrol into the new t*Rez solution. This blurb should entice the reader to continue down the page to explore different artifacts (articles, releases, studies, etc).';
    vm.ParallaxCaption2 = 'In The News';
    vm.ReleasesHeading = 'This Just In';
    vm.ReleasesText = 'This is a blurb that introduces what the world is saying about antioxidants, resveratrol, and t*Rez.';

    vm.status = { isCustomHeaderOpen: false, isFirstOpen: true, isFirstDisabled: false };
  }
}());
