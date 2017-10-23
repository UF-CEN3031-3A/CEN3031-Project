(function () {
  'use strict';

  describe('Faqs Route Tests', function () {
    // Initialize global variables
    var $scope,
      FaqsService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _FaqsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      FaqsService = _FaqsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('admin.faqs');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/faqs');
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
          liststate = $state.get('admin.faqs.list');
        }));

        it('Should have the correct URL', function () {
          expect(liststate.url).toEqual('');
        });

        it('Should be not abstract', function () {
          expect(liststate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(liststate.templateUrl).toBe('/modules/faqs/client/views/admin/list-faqs.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          FaqsAdminController,
          mockFaq;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('admin.faqs.create');
          $templateCache.put('/modules/faqs/client/views/admin/form-faq.client.view.html', '');

          // Create mock faq
          mockFaq = new FaqsService();

          // Initialize Controller
          FaqsAdminController = $controller('FaqsAdminController as vm', {
            $scope: $scope,
            faqResolve: mockFaq
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.faqResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/admin/faqs/create');
        }));

        it('should attach an faq to the controller scope', function () {
          expect($scope.vm.faq._id).toBe(mockFaq._id);
          expect($scope.vm.faq._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('/modules/faqs/client/views/admin/form-faq.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          FaqsAdminController,
          mockFaq;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('admin.faqs.edit');
          $templateCache.put('/modules/faqs/client/views/admin/form-faq.client.view.html', '');

          // Create mock faq
          mockFaq = new FaqsService({
            _id: '525a8422f6d0f87f0e407a33',
            title: 'An Faq about MEAN',
            content: 'MEAN rocks!'
          });

          // Initialize Controller
          FaqsAdminController = $controller('FaqsAdminController as vm', {
            $scope: $scope,
            faqResolve: mockFaq
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:faqId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.faqResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            faqId: 1
          })).toEqual('/admin/faqs/1/edit');
        }));

        it('should attach an faq to the controller scope', function () {
          expect($scope.vm.faq._id).toBe(mockFaq._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('/modules/faqs/client/views/admin/form-faq.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
