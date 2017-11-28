(function (app) {
  'use strict';

  app.registerModule('hometexts', ['core']);// The core module is required for special route handling; see /core/client/config/core.client.routes
  app.registerModule('hometexts.admin', ['core.admin']);
  app.registerModule('hometexts.admin.routes', ['core.admin.routes']);
  app.registerModule('hometexts.services');
  app.registerModule('hometexts.routes', ['ui.router', 'core.routes', 'hometexts.services']);
}(ApplicationConfiguration));
