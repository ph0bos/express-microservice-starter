'use strict';

/*
 * Dependencies
 */
var VitalSigns = require('vitalsigns');

/**
 * Initialize Vitals
 *
 * @returns {VitalSigns}
 */
module.exports = function() {
  var vitals = new VitalSigns();

  // Standard Vitals
  vitals.monitor('cpu');
  vitals.monitor('mem', {units: 'MB'});
  vitals.monitor('tick');
  vitals.monitor('uptime');

  // Health Checks
  vitals.unhealthyWhen('cpu', 'usage').equals(100);
  vitals.unhealthyWhen('tick', 'maxMs').greaterThan(500);

  return vitals;
}
