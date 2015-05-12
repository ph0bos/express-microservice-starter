'user strict';

var pkgInfo   = require('./package.json');
var path      = require('path');
var caller    = require('caller');
var konfig    = require('konfig');
var express   = require('express');
var enrouten  = require('express-enrouten');
var bootstrap = require('./lib/bootstrap');
var log       = require('bunyan').createLogger({ name: 'microservice' });

/**
 *
 */
var buildOptions = function(options) {
  var config = konfig({ path: options.configPath || './config' });

  // Default options
  options                 = options || {};
  options.server          = options.server || { port: process.env.PORT };
  options.debug           = options.debug || false;
  options.discoverable    = options.discoverable || false;
  options.routesPath      = options.routesPath || 'controllers';
  options.callerPath      = path.dirname(caller(2));
  options.serviceName     = pkgInfo.name;
  options.serviceBasePath = 'services';
  options.zookeeper       = { connectionString: 'localhost:2181', retry: { count: 5 } };

  // Return now if we have no config
  if (!config.app) {
    return options;
  }

  // Overlay config file options
  options.server          = config.app.server || { port: process.env.PORT };
  options.serviceName     = config.app.microservice.server.name || pkgInfo.name;
  options.serviceBasePath = config.app.microservice.basePath || 'services';
  options.zookeeper       = config.app.zookeeper || { connectionString: 'localhost:2181', retry: { count: 5 } };
  
  return options;
};

/**
 *
 */
module.exports = function (options) {
  var app = express();

  options = buildOptions(options);

  bootstrap(app, options);

  if (options.debug) {
    log.info(options, 'bootstrapped microservice');
  } 

  return app;
};