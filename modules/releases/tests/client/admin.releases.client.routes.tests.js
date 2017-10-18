(function () {
  'use strict';

  describe('Releases Route Tests', function () {
    // Initialize global variables
    var $scope,
      ReleasesService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _ReleasesService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      ReleasesService = _ReleasesService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('admin.releases');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/releases');
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
          liststate = $state.get('admin.releases.list');
        }));

        it('Should have the correct URL', function () {
          expect(liststate.url).toEqual('');
        });

        it('Should be not abstract', function () {
          expect(liststate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(liststate.templateUrl).toBe('/modules/releases/client/views/admin/list-releases.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          ReleasesAdminController,
          mockRelease;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('admin.releases.create');
          $templateCache.put('/modules/releases/client/views/admin/form-release.client.view.html', '');

          // Create mock release
          mockRelease = new ReleasesService();

          // Initialize Controller
          ReleasesAdminController = $controller('ReleasesAdminController as vm', {
            $scope: $scope,
            releaseResolve: mockRelease
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.releaseResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/admin/releases/create');
        }));

        it('should attach an release to the controller scope', function () {
          expect($scope.vm.release._id).toBe(mockRelease._id);
          expect($scope.vm.release._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('/modules/releases/client/views/admin/form-release.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          ReleasesAdminController,
          mockRelease;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('admin.releases.edit');
          $templateCache.put('/modules/releases/client/views/admin/form-release.client.view.html', '');

          // Create mock release
          mockRelease = new ReleasesService({
            _id: '525a8422f6d0f87f0e407a33',
            title: 'An Release about MEAN',
            content: 'MEAN rocks!'
          });

          // Initialize Controller
          ReleasesAdminController = $controller('ReleasesAdminController as vm', {
            $scope: $scope,
            releaseResolve: mockRelease
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:releaseId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.releaseResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            releaseId: 1
          })).toEqual('/admin/releases/1/edit');
        }));

        it('should attach an release to the controller scope', function () {
          expect($scope.vm.release._id).toBe(mockRelease._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('/modules/releases/client/views/admin/form-release.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
