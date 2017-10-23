(function (app) {
  'use strict';

  app.registerModule('faqs', ['core']);// The core module is required for special route handling; see /core/client/config/core.client.routes
  app.registerModule('faqs.admin', ['core.admin']);
  app.registerModule('faqs.admin.routes', ['core.admin.routes']);
  app.registerModule('faqs.services');
  app.registerModule('faqs.routes', ['ui.router', 'core.routes', 'faqs.services']);
}(ApplicationConfiguration));
