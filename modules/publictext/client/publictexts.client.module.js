(function (app) {
  'use strict';

  app.registerModule('publictexts', ['core']);// The core module is required for special route handling; see /core/client/config/core.client.routes
  app.registerModule('publictexts.admin', ['core.admin']);
  app.registerModule('publictexts.admin.routes', ['core.admin.routes']);
  app.registerModule('publictexts.services');
  app.registerModule('publictexts.routes', ['ui.router', 'core.routes', 'publictexts.services']);
}(ApplicationConfiguration));
