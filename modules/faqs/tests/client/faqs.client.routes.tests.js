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
          mainstate = $state.get('faqs');
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
          liststate = $state.get('faqs.list');
        }));

        it('Should have the correct URL', function () {
          expect(liststate.url).toEqual('');
        });

        it('Should not be abstract', function () {
          expect(liststate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(liststate.templateUrl).toBe('/modules/faqs/client/views/list-faqs.client.view.html');
        });
      });

      describe('View Route', function () {
        var viewstate,
          FaqsController,
          mockFaq;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('faqs.view');
          $templateCache.put('/modules/faqs/client/views/view-faq.client.view.html', '');

          // create mock faq
          mockFaq = new FaqsService({
            _id: '525a8422f6d0f87f0e407a33',
            title: 'An Faq about MEAN',
            content: 'MEAN rocks!'
          });

          // Initialize Controller
          FaqsController = $controller('FaqsController as vm', {
            $scope: $scope,
            faqResolve: mockFaq
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:faqId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.faqResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            faqId: 1
          })).toEqual('/faqs/1');
        }));

        it('should attach an faq to the controller scope', function () {
          expect($scope.vm.faq._id).toBe(mockFaq._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('/modules/faqs/client/views/view-faq.client.view.html');
        });
      });

      describe('Handle Trailing Slash', function () {
        beforeEach(inject(function ($state, $rootScope, $templateCache) {
          $templateCache.put('/modules/faqs/client/views/list-faqs.client.view.html', '');

          $state.go('faqs.list');
          $rootScope.$digest();
        }));

        it('Should remove trailing slash', inject(function ($state, $location, $rootScope) {
          $location.path('faqs/');
          $rootScope.$digest();

          expect($location.path()).toBe('/faqs');
          expect($state.current.templateUrl).toBe('/modules/faqs/client/views/list-faqs.client.view.html');
        }));
      });
    });
  });
}());
