'use strict';

describe('Faqs E2E Tests:', function () {
  describe('Test faqs page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/faqs');
      expect(element.all(by.repeater('faq in faqs')).count()).toEqual(0);
    });
  });
});
