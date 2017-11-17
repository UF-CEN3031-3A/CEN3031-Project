(function () {
  'use strict';

  describe('Abouts Route Tests', function () {
    // Initialize global variables
    var $scope,
      AboutsService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _AboutsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      AboutsService = _AboutsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('abouts');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/abouts');
        });

        it('Should be abstract', function () {
          expect(mainstate.abstract).toBe(true);
        });

        it('Should have template', function () {
          expect(mainstate.template).toBe('<ui-view/>');
        });
      });

      describe('List Route', function () {
        var liststate;
        beforeEach(inject(function ($state) {
          liststate = $state.get('abouts.list');
        }));

        it('Should have the correct URL', function () {
          expect(liststate.url).toEqual('');
        });

        it('Should not be abstract', function () {
          expect(liststate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(liststate.templateUrl).toBe('/modules/abouts/client/views/list-abouts.client.view.html');
        });
      });

      describe('View Route', function () {
        var viewstate,
          AboutsController,
          mockAbout;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('abouts.view');
          $templateCache.put('/modules/abouts/client/views/view-about.client.view.html', '');

          // create mock about
          mockAbout = new AboutsService({
            _id: '525a8422f6d0f87f0e407a33',
            title: 'An About about MEAN',
            content: 'MEAN rocks!'
          });

          // Initialize Controller
          AboutsController = $controller('AboutsController as vm', {
            $scope: $scope,
            aboutResolve: mockAbout
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:aboutId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.aboutResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            aboutId: 1
          })).toEqual('/abouts/1');
        }));

        it('should attach an about to the controller scope', function () {
          expect($scope.vm.about._id).toBe(mockAbout._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('/modules/abouts/client/views/view-about.client.view.html');
        });
      });

      describe('Handle Trailing Slash', function () {
        beforeEach(inject(function ($state, $rootScope, $templateCache) {
          $templateCache.put('/modules/abouts/client/views/list-abouts.client.view.html', '');

          $state.go('abouts.list');
          $rootScope.$digest();
        }));

        it('Should remove trailing slash', inject(function ($state, $location, $rootScope) {
          $location.path('abouts/');
          $rootScope.$digest();

          expect($location.path()).toBe('/abouts');
          expect($state.current.templateUrl).toBe('/modules/abouts/client/views/list-abouts.client.view.html');
        }));
      });
    });
  });
}());
