'use strict';

/*
 * Dependencies
 */
var VitalSigns = require('vitalsigns');

module.exports = function () {
  var vitals = new VitalSigns();

  // Add a custom monitor
  vitals.monitor(require('./monitors/my-custom-monitor'));

  // Add a health check for the custom monitor
  vitals.unhealthyWhen('myCustomMonitor', 'message').equals("Goodbye");

  return vitals;
};
