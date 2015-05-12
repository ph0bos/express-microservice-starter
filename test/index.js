'use strict';

/*
 * Dependencies
 */
var express = require('express');
var micro   = require('../');

var app  = express();

app.use(micro({ discoverable: true }));

app.listen(9000, function onListen() {
  console.log('listening');
});
