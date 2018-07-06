'use strict';

/*
 * Dependencies
 */
var packageInfo = require(process.cwd() + '/package.json');

/**
 * Initialize Info Actuator endpoints
 *
 * @param app
 */
module.exports = function (router) {
  router.get('/', function (req, res, next) {
    res.json({
      "build": {
        "description": packageInfo.description,
        "version": process.env.VERSION || packageInfo.version,
        "name": packageInfo.name
      }
    });
  });
};
