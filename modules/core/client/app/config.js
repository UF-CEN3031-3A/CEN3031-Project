(function (window) {
  'use strict';

  var applicationModuleName = 'mean';

  var service = {
    applicationEnvironment: window.env,
    applicationModuleName: applicationModuleName,
    applicationModuleVendorDependencies: ['ngResource', 'ngAnimate', 'ngMessages', 'ui.router', 'ui.bootstrap', 'ngFileUpload', 'ui-notification'],
    registerModule: registerModule
  };

  window.ApplicationConfiguration = service;

  // Add a new vertical module
  function registerModule(moduleName, dependencies) {
    // Create angular module
    angular.module(moduleName, dependencies || []);

    // Add the module to the AngularJS configuration file
    angular.module(applicationModuleName).requires.push(moduleName);
  }

  // Angular-ui-notification configuration
  var app = angular.module('ui-notification').config(function (NotificationProvider) {
    NotificationProvider.setOptions({
      delay: 2000,
      startTop: 20,
      startRight: 10,
      verticalSpacing: 20,
      horizontalSpacing: 20,
      positionX: 'right',
      positionY: 'bottom'
    });
  });

  app.run(function ($rootScope, $state) {
    $rootScope.$on('$stateChangeSuccess', function () {
      window.scrollTo(0, 0);
    });

    $rootScope.business_inquiry = function () {
      $state.go('business_inquiry');
    };
    $rootScope.public_inquiry = function () {
      $state.go('faqs.list');
    };
    $rootScope.about_us = function () {
      $state.go('abouts.list');
    };
    $rootScope.blog = function () {
      $state.go('articles.list');
    };

  });


}(window));
