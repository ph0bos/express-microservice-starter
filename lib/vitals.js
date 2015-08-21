'use strict';

/*
 * Dependencies
 */
var VitalSigns = require('vitalsigns');
var zoologist  = require('./zoologist');
var path       = require('path');
var caller     = require('caller');

/**
 * VitalSignsConfig Constructor
 *
 * @public
 * @constructor VitalSignsConfig
 *
 */
function VitalSignsConfig() {
  this.vitals = null;
}

/**
 * Initialise the VitalSigns instance.
 *
 * @public
 * @method initialise
 */
VitalSignsConfig.prototype.initialise = function (options) {

  var vitals;

  // Try and load vitals from the caller path? (inherit from the parent application)
  try {
    vitals = require(path.resolve(options.callerPath, options.monitorsPath))();
  } catch (err) {
    // Can't find any vitals continue...
  }

  // Use provided VitalSigns instance or create new
  this.vitals = (vitals && vitals instanceof VitalSigns) ? vitals : new VitalSigns();

  // Standard Vitals
  this.vitals.monitor('mem', { units: 'MB' });
  this.vitals.monitor('uptime');

  if (zoologist.isInitialised()) {
    // ZooKeeper Vitals
    this.vitals.monitor(require('./monitors/zookeeper-monitor'));
    this.vitals.unhealthyWhen('zookeeper', 'status').equals("DOWN");

    // Microservice Vitals
    this.vitals.monitor(require('./monitors/microservice-monitor'));
    this.vitals.unhealthyWhen('microservice', 'status').equals("DOWN");
  }
};

/**
 * Return the vitals instance.
 *
 * @public
 * @method getVitals
 */
VitalSignsConfig.prototype.getVitals = function () {
  return this.vitals;
};

/**
 * Return the Express endpoint for vitals.
 *
 * The endpoint is a GET route that responds with a JSON represenation of the monitors. A healthy
 * service returns a 200 status code, an-unhealthy returns 500 status code.
 *
 * @public
 * @method getExpress
 */
VitalSignsConfig.prototype.getExpress = function () {
  return this.vitals.express;
};

var vitalSignsConfig = module.exports = exports = new VitalSignsConfig;
