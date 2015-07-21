'use strict';

/*
 * Dependencies
 */
var log     = require('bunyan').createLogger({ name: 'test-app' });
var express = require('express');
var micro   = require('../');

var app  = express();

app.use(micro({
  discoverable: false,
  debug: true
}));

app.listen(8000, function onListen() {
  log.info('example app initialised and serving at the following root: http://localhost:8000/starter/v1');
});
