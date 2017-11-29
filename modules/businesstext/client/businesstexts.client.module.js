(function (app) {
  'use strict';

  app.registerModule('businesstexts', ['core']);// The core module is required for special route handling; see /core/client/config/core.client.routes
  app.registerModule('businesstexts.admin', ['core.admin']);
  app.registerModule('businesstexts.admin.routes', ['core.admin.routes']);
  app.registerModule('businesstexts.services');
  app.registerModule('businesstexts.routes', ['ui.router', 'core.routes', 'businesstexts.services']);
}(ApplicationConfiguration));
