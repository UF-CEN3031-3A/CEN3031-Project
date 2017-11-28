'use strict';

/**
 * Module dependencies
 */
var abouttextsPolicy = require('../policies/abouttexts.server.policy'),
  abouttexts = require('../controllers/abouttexts.server.controller');

module.exports = function (app) {
  // Abouttexts collection routes
  app.route('/api/abouttexts').all(abouttextsPolicy.isAllowed)
    .get(abouttexts.list)
    .post(abouttexts.create);

  // Single abouttext routes
  app.route('/api/abouttexts/:abouttextId').all(abouttextsPolicy.isAllowed)
    .get(abouttexts.read)
    .put(abouttexts.update)
    .delete(abouttexts.delete);

  // Finish by binding the abouttext middleware
  app.param('abouttextId', abouttexts.abouttextByID);
};
