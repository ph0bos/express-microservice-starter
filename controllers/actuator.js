'use strict';

/*
 * Dependencies
 */
var packageInfo = require(process.cwd() + '/package.json');
var vitals      = require('../lib/vitals');

/**
 * Initialize Actuator endpoints
 *
 * @param app
 */
module.exports = function (router) {

  /*
   * Health Endpoint
   */
  router.get('/health', vitals.getExpress());

  /*
   * Info Endpoint
   */
  router.get('/info', function (req, res, next) {
    res.json({
      "build": {
        "description": packageInfo.description,
        "version": packageInfo.version,
        "name": packageInfo.name
      }
    });
  });
};
