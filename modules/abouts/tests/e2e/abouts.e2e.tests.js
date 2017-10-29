'use strict';

describe('Abouts E2E Tests:', function () {
  describe('Test abouts page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/abouts');
      expect(element.all(by.repeater('about in abouts')).count()).toEqual(0);
    });
  });
});
