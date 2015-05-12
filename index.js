'user strict';

var pkgInfo   = require('./package.json');
var path      = require('path');
var caller    = require('caller');
var konfig    = require('konfig');
var express   = require('express');
var enrouten  = require('express-enrouten');
var bootstrap = require('./lib/bootstrap');

/**
 *
 */
var buildOptions = function(options) {
  var config = konfig({ path: options.configPath || './config' });

  options                 = options || {};
  options.debug           = options.debug || false;
  options.server          = config.app.server || { port: 8000 };

  options.serviceName     = config.app.microservice.server.name || pkgInfo.name;
  options.serviceBasePath = config.app.microservice.basePath || 'services';
  
  options.zookeeper       = config.app.zookeeper || { connectionString: 'localhost:2181' };
  options.discoverable    = options.discoverable || false;
  options.routesPath      = options.routesPath || 'controllers';
  options.callerPath      = path.dirname(caller(2));
  
  return options;
};

/**
 *
 */
module.exports = function (options) {
  var app = express();

  options = buildOptions(options);

  bootstrap(app, options);

  return app;
};