'use strict';

var path      = require('path');
var caller    = require('caller');
var enrouten  = require('express-enrouten');
var zoologist = require('./zoologist');

module.exports = function (app, options) {

  // starter routes (e.g. actuator)
  app.use('/' + options.serviceName, enrouten({ directory: '../controllers' }));
  
  // implementor routes
  app.use('/' + options.serviceName, enrouten({ directory: options.callerPath + '/' + options.routesPath }));
  
  // sub-app mount operations
  app.once('mount', function onmount(parent) {
    if (options.discoverable) {

      var zoo = zoologist(options);

      zoo.serviceDiscovery.registerService(function onRegister(err, data) {
        console.log(data);
      });

      zoo.client.on('connected', function() {
        console.log('connect');
      });

      zoo.client.on('disconnected', function() {
        console.log('disconnect');
      });
    }
  });
};