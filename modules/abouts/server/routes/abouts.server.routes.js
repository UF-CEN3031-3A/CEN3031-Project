'use strict';

/**
 * Module dependencies
 */
var aboutsPolicy = require('../policies/abouts.server.policy'),
  abouts = require('../controllers/abouts.server.controller');

module.exports = function (app) {
  // Abouts collection routes
  app.route('/api/abouts').all(aboutsPolicy.isAllowed)
    .get(abouts.list)
    .post(abouts.create);

  // Single about routes
  app.route('/api/abouts/:aboutId').all(aboutsPolicy.isAllowed)
    .get(abouts.read)
    .put(abouts.update)
    .delete(abouts.delete);

  app.route('/api/abouts/picture').post(abouts.changeAboutPicture);


  // Finish by binding the about middleware
  app.param('aboutId', abouts.aboutByID);
};
