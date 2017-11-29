'use strict';

/**
 * Module dependencies
 */
var businesstextsPolicy = require('../policies/businesstexts.server.policy'),
  businesstexts = require('../controllers/businesstexts.server.controller');

module.exports = function (app) {
  // Businesstexts collection routes
  app.route('/api/businesstexts').all(businesstextsPolicy.isAllowed)
    .get(businesstexts.list)
    .post(businesstexts.create);

  // Single businesstext routes
  app.route('/api/businesstexts/:businesstextId').all(businesstextsPolicy.isAllowed)
    .get(businesstexts.read)
    .put(businesstexts.update)
    .delete(businesstexts.delete);

  // Finish by binding the businesstext middleware
  app.param('businesstextId', businesstexts.businesstextByID);
};
