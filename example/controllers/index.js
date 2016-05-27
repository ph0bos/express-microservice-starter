'use strict';

var util = require('util');

/**
 * Index Controller
 */
module.exports = function (router) {
  router.get('/', function (req, res, next) {
    res.json({
      "message": "Index"
    });
  });
};
