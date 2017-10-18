'use strict';

/**
 * Module dependencies
 */
var releasesPolicy = require('../policies/releases.server.policy'),
  releases = require('../controllers/releases.server.controller');

module.exports = function (app) {
  // Releases collection routes
  app.route('/api/releases').all(releasesPolicy.isAllowed)
    .get(releases.list)
    .post(releases.create);

  // Single release routes
  app.route('/api/releases/:releaseId').all(releasesPolicy.isAllowed)
    .get(releases.read)
    .put(releases.update)
    .delete(releases.delete);

  // Finish by binding the release middleware
  app.param('releaseId', releases.releaseByID);
};
