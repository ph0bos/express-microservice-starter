'use strict';

/*
 * Dependencies
 */
var path       = require('path');
var fs         = require('fs');
var enrouten   = require('express-enrouten');
var bodyParser = require('body-parser');
var cors       = require('cors');
var cache      = require('express-cache-response-directive');
var zoologist  = require('./zoologist');
var log        = require('./logger');
var partialRes = require('express-partial-response');
var validator  = require('express-validator');
var correlate  = require('./middleware/correlate');
var swagger    = require('./swagger');

/**
 * Bootstrap the microservice.
 *
 * @public
 */
module.exports = function (app, options) {

  var controllersPath = path.resolve(options.callerPath, options.controllersPath);

  // Init Vitals Monitoring
  require('./vitals').initialise(options);

  // Enable CORS
  app.use(cors({ preflightContinue: true }));

  // Disable etag
  if (options.etag === false){
    app.set('etag', false);
  }

  // Setup Cache Control
  app.use(cache());

  if (options.enableBodyParsing) {
    // Parse application/x-www-form-urlencoded
    app.use(bodyParser.urlencoded({ extended: false }));

    // Parse application/json / validators
    app.use(bodyParser.json());
  }
  if (options.enableBodyParsing || options.validatorOptions) {
    app.use(validator(options.validatorOptions));
  }

  // Partial Response
  app.use(partialRes({ query: options.partialResponseQuery }));

  // Correlation
  app.use(correlate({ headerName: options.correlationHeaderName }));

  // Starter routes (e.g. actuator)
  app.use('/' + options.serviceName, enrouten({ directory: '../controllers' }));

  // Implementor routes
  if (options.swaggerConfig) {

    //  bind swagger doc to handlers
    swagger(app, options);
  }
  else if (options.controllersPath) {
    try {
      // Check that controller path exists
      fs.accessSync(controllersPath, fs.F_OK);

      // Implementor controller defined routes
      app.use('/' + options.serviceName, enrouten({ directory: controllersPath }));

    } catch (e) {
      log.error(e, 'Error bootstrapping controllers');
    }
  }

  else {
    log.error(e, 'Error bootstrapping controllers: no options specified for either controllersPath or swaggerConfig');
  }

  // Make service discoverable?
  if (options.discoverable) {

    zoologist.on('ready', function () {
      app.emit('zookeeper:connected');

      zoologist.getServiceDiscovery().registerService(function onRegister(err, data) {
        if (err) {
          log.error(err, 'error registering microservice with zookeeper');
        }

        app.locals.microservice = data;
        app.emit('service:registered', data);

        if (options.debug) {
          log.info(data, 'microservice registered with zookeeper');
        }
      });

      zoologist.on('disconnected', function () {
        delete app.locals.microservice;
        app.emit('zookeeper:disconnected');
      });

      zoologist.on('error', function (err) {
        delete app.locals.microservice;
        app.emit('zookeeper:error', err);
      });
    });
  }
};
