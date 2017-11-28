(function (app) {
  'use strict';

  app.registerModule('abouttexts', ['core']);// The core module is required for special route handling; see /core/client/config/core.client.routes
  app.registerModule('abouttexts.admin', ['core.admin']);
  app.registerModule('abouttexts.admin.routes', ['core.admin.routes']);
  app.registerModule('abouttexts.services');
  app.registerModule('abouttexts.routes', ['ui.router', 'core.routes', 'abouttexts.services']);
}(ApplicationConfiguration));
