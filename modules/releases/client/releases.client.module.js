(function (app) {
  'use strict';

  app.registerModule('releases', ['core']);// The core module is required for special route handling; see /core/client/config/core.client.routes
  app.registerModule('releases.admin', ['core.admin']);
  app.registerModule('releases.admin.routes', ['core.admin.routes']);
  app.registerModule('releases.services');
  app.registerModule('releases.routes', ['ui.router', 'core.routes', 'releases.services']);
}(ApplicationConfiguration));
