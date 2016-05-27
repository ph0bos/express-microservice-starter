'use strict';

/*
 * Dependencies
 */
var vitals = require('../lib/vitals');

/**
 * Initialize Health Actuator endpoints
 *
 * @param app
 */
module.exports = function (router) {
  router.get('/', vitals.getExpress());
};
