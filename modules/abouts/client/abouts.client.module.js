(function (app) {
  'use strict';

  app.registerModule('abouts', ['core']);// The core module is required for special route handling; see /core/client/config/core.client.routes
  app.registerModule('abouts.admin', ['core.admin']);
  app.registerModule('abouts.admin.routes', ['core.admin.routes']);
  app.registerModule('abouts.services');
  app.registerModule('abouts.routes', ['ui.router', 'core.routes', 'abouts.services']);
}(ApplicationConfiguration));
