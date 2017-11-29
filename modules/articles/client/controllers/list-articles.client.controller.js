(function () {
  'use strict';

  angular
    .module('articles')
    .controller('ArticlesListController', ArticlesListController);

  ArticlesListController.$inject = ['ArticlesService', 'BlogtextsService'];

  function ArticlesListController(ArticlesService, BlogtextsService) {
    var vm = this;

    vm.blogtext = BlogtextsService.query();

    vm.articles = ArticlesService.query();

    vm.oneAtATime = true;

    vm.years = [
        { number: '2017' },
        { number: '2016' },
        { number: '2015' }
    ];

    vm.months = [
        { name: 'January' },
        { name: 'February' },
        { name: 'March' },
        { name: 'April' },
        { name: 'May' },
        { name: 'June' },
        { name: 'July' },
        { name: 'August' },
        { name: 'September' },
        { name: 'October' },
        { name: 'November' },
        { name: 'December' }
    ];

    vm.status = {
      isCustomHeaderOpen: false,
      isFirstOpen: true,
      isFirstDisabled: false
    };
  }
}());
