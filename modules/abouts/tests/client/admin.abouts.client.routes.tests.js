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
          mainstate = $state.get('admin.abouts');
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
          liststate = $state.get('admin.abouts.list');
        }));

        it('Should have the correct URL', function () {
          expect(liststate.url).toEqual('');
        });

        it('Should be not abstract', function () {
          expect(liststate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(liststate.templateUrl).toBe('/modules/abouts/client/views/admin/list-abouts.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          AboutsAdminController,
          mockAbout;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('admin.abouts.create');
          $templateCache.put('/modules/abouts/client/views/admin/form-about.client.view.html', '');

          // Create mock about
          mockAbout = new AboutsService();

          // Initialize Controller
          AboutsAdminController = $controller('AboutsAdminController as vm', {
            $scope: $scope,
            aboutResolve: mockAbout
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.aboutResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/admin/abouts/create');
        }));

        it('should attach an about to the controller scope', function () {
          expect($scope.vm.about._id).toBe(mockAbout._id);
          expect($scope.vm.about._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('/modules/abouts/client/views/admin/form-about.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          AboutsAdminController,
          mockAbout;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('admin.abouts.edit');
          $templateCache.put('/modules/abouts/client/views/admin/form-about.client.view.html', '');

          // Create mock about
          mockAbout = new AboutsService({
            _id: '525a8422f6d0f87f0e407a33',
            title: 'An About about MEAN',
            content: 'MEAN rocks!'
          });

          // Initialize Controller
          AboutsAdminController = $controller('AboutsAdminController as vm', {
            $scope: $scope,
            aboutResolve: mockAbout
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:aboutId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.aboutResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            aboutId: 1
          })).toEqual('/admin/abouts/1/edit');
        }));

        it('should attach an about to the controller scope', function () {
          expect($scope.vm.about._id).toBe(mockAbout._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('/modules/abouts/client/views/admin/form-about.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
