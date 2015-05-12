'use strict';

var path       = require('path');
var caller     = require('caller');
var enrouten   = require('express-enrouten');
var bodyParser = require('body-parser');
var cors       = require('cors');
var cache      = require('express-cache-response-directive');
var zoologist  = require('./zoologist')();

module.exports = function (app, options) {
  
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
  
  // Sub-app mount operations
  app.once('mount', function onmount(parent) {
    if (options.discoverable) {
      zoologist.init(options);

      // Connect Event
      zoologist.getClient().on('connected', function() {
        zoologist.init(options);

        zoologist.getServiceDiscovery().registerService(function onRegister(err, data) {
          // registered
        });
      });

      // Disconnect Event
      zoologist.getClient().on('disconnected', function() {
        zoologist.close();
      });
    }
  });
};