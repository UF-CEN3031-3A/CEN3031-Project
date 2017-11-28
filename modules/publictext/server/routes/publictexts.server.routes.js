'use strict';

/**
 * Module dependencies
 */
var publictextsPolicy = require('../policies/publictexts.server.policy'),
  publictexts = require('../controllers/publictexts.server.controller');

module.exports = function (app) {
  // Publictexts collection routes
  app.route('/api/publictexts').all(publictextsPolicy.isAllowed)
    .get(publictexts.list)
    .post(publictexts.create);

  // Single publictext routes
  app.route('/api/publictexts/:publictextId').all(publictextsPolicy.isAllowed)
    .get(publictexts.read)
    .put(publictexts.update)
    .delete(publictexts.delete);

  // Finish by binding the publictext middleware
  app.param('publictextId', publictexts.publictextByID);
};
