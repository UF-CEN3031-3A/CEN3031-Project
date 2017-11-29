(function () {
  'use strict';

  angular
    .module('blogtexts.admin.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('admin.blogtext', {
        abstract: true,
        url: '/blogtext',
        template: '<ui-view/>'
      })
      .state('admin.blogtext.list', {
        url: '',
        templateUrl: '/modules/blogtext/client/views/admin/list-blogtexts.client.view.html',
        controller: 'BlogtextsAdminListController',
        controllerAs: 'vm',
        data: {
          roles: ['admin']
        }
      })
      .state('admin.blogtext.create', {
        url: '/create',
        templateUrl: '/modules/blogtext/client/views/admin/form-blogtext.client.view.html',
        controller: 'BlogtextsAdminController',
        controllerAs: 'vm',
        data: {
          roles: ['admin']
        },
        resolve: {
          blogtextResolve: newBlogtext
        }
      })
      .state('admin.blogtext.edit', {
        url: '/:blogtextId/edit',
        templateUrl: '/modules/blogtext/client/views/admin/form-blogtext.client.view.html',
        controller: 'BlogtextsAdminController',
        controllerAs: 'vm',
        data: {
          roles: ['admin'],
          pageTitle: '{{ blogtextResolve.title }}'
        },
        resolve: {
          blogtextResolve: getBlogtext
        }
      });
  }

  getBlogtext.$inject = ['$stateParams', 'BlogtextsService'];

  function getBlogtext($stateParams, BlogtextsService) {
    return BlogtextsService.get({
      blogtextId: $stateParams.blogtextId
    }).$promise;
  }

  newBlogtext.$inject = ['BlogtextsService'];

  function newBlogtext(BlogtextsService) {
    return new BlogtextsService();
  }
}());
