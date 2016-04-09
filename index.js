'user strict';

var pkgInfo   = require('./package.json');
var path      = require('path');
var caller    = require('caller');
var konfig    = require('konfig');
var express   = require('express');
var enrouten  = require('express-enrouten');
var bootstrap = require('./lib/bootstrap');
var zoologist = require('./lib/zoologist');
var log       = require('./lib/logger');

/**
 * Create an instance of a microservice and mount upon the parent
 * Express application.
 *
 * @public
 */
module.exports = function (options) {
  var app = express();

  options = buildOptions(options);

  if (options.discoverable) {
    zoologist.initialise(options);
  }

  app.once('mount', function onmount(parent) {
    bootstrap(parent, options);

    if (options.debug) {
      log.info(options, 'bootstrapped microservice');
    }
  });

  return app;
};

/**
 * Construct an options instance.
 */
var buildOptions = function(options) {
  options    = options || {};

  var config = konfig({ path: options.configPath || process.cwd() + '/config' });

  // Default options
  options.server                = options.server || { port: process.env.PORT };
  options.debug                 = options.debug || false;
  options.discoverable          = options.discoverable || false;
  options.monitorsPath          = options.monitorsPath || 'monitors';
  options.controllersPath       = options.controllersPath || 'controllers';
  options.callerPath            = path.dirname(caller(2));
  options.serviceName           = pkgInfo.name;
  options.serviceBasePath       = 'services';
  options.zookeeper             = { connectionString: 'localhost:2181', retry: { count: 5 } };
  options.partialResponseQuery  = options.partialResponseQuery || 'fields';
  options.correlationHeaderName = options.correlationHeaderName || 'X-CorrelationID';

  // Return now if we have no config
  if (!config.app) {
    return options;
  }

  // Overlay config file options
  options.server              = config.app.server || { port: process.env.PORT };
  options.serviceName         = config.app.microservice.server.name || pkgInfo.name;
  options.serviceBasePath     = config.app.microservice.basePath || 'services';
  options.serviceDependencies = (config.app.microservice.server.dependencies) ? config.app.microservice.server.dependencies.split(',') : null;
  options.zookeeper           = config.app.zookeeper || { connectionString: 'localhost:2181', retry: { count: 5 } };

  return options;
};
