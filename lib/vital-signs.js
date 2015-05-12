'use strict';

/*
 * Dependencies
 */
var VitalSigns = require('vitalsigns');
var zoologist  = require('./zoologist')();

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

  // ZooKeeper Vitals
  vitals.monitor({
    name: 'zookeeper',
    report: function() {
      return {
        status: (zoologist.getClient().getClient().getState().name === 'SYNC_CONNECTED') ? 'UP' : 'DOWN',
        connectionState: zoologist.getClient().getClient().getState().name,
        connecionString: zoologist.getClient().getClient().connectionManager.connectionStringParser.connectionString
      }
    } 
  });

  // Microservice Vitals
  vitals.monitor({
    name: 'microservice',
    report: function() {
      if (!zoologist.getServiceDiscovery() || !zoologist.getServiceDiscovery().getData()) {
        return {
          status: (zoologist.getClient().getClient().getState().name === 'SYNC_CONNECTED') ? 'UP' : 'DOWN'
        }
      }

      return {
        id: zoologist.getServiceDiscovery().getData().id,
        status: (zoologist.getClient().getClient().getState().name === 'SYNC_CONNECTED') ? 'UP' : 'DOWN',
        name: zoologist.getServiceInstance().getData().name,
        basePath: zoologist.getServiceInstance().basePath,
        address: zoologist.getServiceInstance().getData().address,
        port: zoologist.getServiceInstance().getData().port,
        registrationTime: new Date(zoologist.getServiceInstance().getData().registrationTimeUTC)
      }
    } 
  });

  // Health Checks
  vitals.unhealthyWhen('cpu', 'usage').equals(100);
  vitals.unhealthyWhen('tick', 'maxMs').greaterThan(500);
  vitals.unhealthyWhen('zookeeper', 'status').equals("DOWN");
  vitals.unhealthyWhen('microservice', 'status').equals("DOWN");

  return vitals;
}
