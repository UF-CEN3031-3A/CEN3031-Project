(function (app) {
  'use strict';

  app.registerModule('blogtexts', ['core']);// The core module is required for special route handling; see /core/client/config/core.client.routes
  app.registerModule('blogtexts.admin', ['core.admin']);
  app.registerModule('blogtexts.admin.routes', ['core.admin.routes']);
  app.registerModule('blogtexts.services');
  app.registerModule('blogtexts.routes', ['ui.router', 'core.routes', 'blogtexts.services']);
}(ApplicationConfiguration));
