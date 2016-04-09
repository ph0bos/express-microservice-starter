'use strict';

/*
 * Dependencies
 */
var path       = require('path');
var enrouten   = require('express-enrouten');
var bodyParser = require('body-parser');
var cors       = require('cors');
var cache      = require('express-cache-response-directive');
var zoologist  = require('./zoologist');
var log        = require('./logger');
var partialRes = require('express-partial-response');
var validator  = require('express-validator');
var correlate  = require('./middleware/correlate');

/**
 * Bootstrap the microservice.
 *
 * @public
 */
module.exports = function (app, options) {

  // Init Vitals Monitoring
  require('./vitals').initialise(options);

  // Enable CORS
  app.use(cors({ preflightContinue: true }));

  // Correlation
  app.use(correlate(options.headerName));

  // Setup Cache Control
  app.use(cache());

  // Parse application/x-www-form-urlencoded
  app.use(bodyParser.urlencoded({ extended: false }));

  // Parse application/json / validators
  app.use(bodyParser.json());
  app.use(validator());

  // Partial Response
  app.use(partialRes({ query: options.partialResponseQuery }));

  // Starter routes (e.g. actuator)
  app.use('/' + options.serviceName, enrouten({ directory: '../controllers' }));

  // Implementor routes
  app.use('/' + options.serviceName, enrouten({ directory: path.resolve(options.callerPath, options.controllersPath) }));

  // Make service discoverable?
  if (options.discoverable) {
    zoologist.on('ready', function() {
      zoologist.getServiceDiscovery().registerService(function onRegister(err, data) {
        if (options.debug) {
          log.info(data, 'microservice registered with zookeeper');
        }
      });
    });
  }
};
