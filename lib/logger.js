'use strict';

var bunyan = require('bunyan');
var config = require('konfig')({path: 'config'});

var options = {};
options.name = config.app.microservice.server.name || 'microservice';

if (config.app.log) {
  options.level = config.app.log.level || 'info';

  if (config.app.log.path) {
    options.streams = [
      {
        type: 'rotating-file',
        path: config.app.log.path
      }
    ];
  }
}

module.exports = bunyan.createLogger(options);
