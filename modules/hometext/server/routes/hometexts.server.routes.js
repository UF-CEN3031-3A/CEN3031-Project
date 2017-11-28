'use strict';

/**
 * Module dependencies
 */
var hometextsPolicy = require('../policies/hometexts.server.policy'),
  hometexts = require('../controllers/hometexts.server.controller');

module.exports = function (app) {
  // Hometexts collection routes
  app.route('/api/hometexts').all(hometextsPolicy.isAllowed)
    .get(hometexts.list)
    .post(hometexts.create);

  // Single hometext routes
  app.route('/api/hometexts/:hometextId').all(hometextsPolicy.isAllowed)
    .get(hometexts.read)
    .put(hometexts.update)
    .delete(hometexts.delete);

  // Finish by binding the hometext middleware
  app.param('hometextId', hometexts.hometextByID);
};
