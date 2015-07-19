'use strict';

var path         = require('path');
var caller       = require('caller');
var enrouten     = require('express-enrouten');
var bodyParser   = require('body-parser');
var cors         = require('cors');
var cache        = require('express-cache-response-directive');
var zoologist    = require('./zoologist');
var log          = require('bunyan').createLogger({ name: 'microservice:bootstrap' });

module.exports = function (app, options) {

  if (options.discoverable) {
    zoologist.init(options);
  }

  if (options.poweredBy) {
    app.use(function(req, res, next) {
      res.setHeader("X-Powered-By", options.poweredBy);
      return next();
    });
  }

  // Enable CORS
  app.use(cors());

  // Setup Cache Control
  app.use(cache());

  // Parse application/x-www-form-urlencoded
  app.use(bodyParser.urlencoded({ extended: false }));

  // Parse application/json
  app.use(bodyParser.json());

  // Starter routes (e.g. actuator)
  app.use('/' + options.serviceName, enrouten({ directory: '../controllers' }));

  // Implementor routes
  app.use('/' + options.serviceName, enrouten({ directory: options.callerPath + '/' + options.routesPath }));

  // Post sub-app mount operations
  app.once('mount', function onMount(parent) {
    // Ready Event
    zoologist.on('ready', function() {
      zoologist.getServiceDiscovery().registerService(function onRegister(err, data) {
        log.info(data, 'service registered');
      });
    });
  });
};
