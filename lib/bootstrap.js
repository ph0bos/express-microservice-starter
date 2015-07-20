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

  // Init Vitals Monitoring
  require('./vital-signs').initialise();

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

  // Make service discoverable?
  if (options.discoverable) {
    zoologist.on('ready', function() {
      zoologist.getServiceDiscovery().registerService(function onRegister(err, data) {
        if (options.debug) {
          log.info(data, 'service registered');
        }
      });
    });
  }
};
