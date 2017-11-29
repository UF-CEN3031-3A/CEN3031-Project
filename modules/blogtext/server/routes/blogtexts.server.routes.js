'use strict';

/**
 * Module dependencies
 */
var blogtextsPolicy = require('../policies/blogtexts.server.policy'),
  blogtexts = require('../controllers/blogtexts.server.controller');

module.exports = function (app) {
  // Blogtexts collection routes
  app.route('/api/blogtexts').all(blogtextsPolicy.isAllowed)
    .get(blogtexts.list)
    .post(blogtexts.create);

  // Single blogtext routes
  app.route('/api/blogtexts/:blogtextId').all(blogtextsPolicy.isAllowed)
    .get(blogtexts.read)
    .put(blogtexts.update)
    .delete(blogtexts.delete);

  // Finish by binding the blogtext middleware
  app.param('blogtextId', blogtexts.blogtextByID);
};
