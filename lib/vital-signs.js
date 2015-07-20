'use strict';

/*
 * Dependencies
 */
var VitalSigns = require('vitalsigns');
var zoologist = require('./zoologist');

function VitalSignsConfig() {
  this.vitals = null;
}

VitalSignsConfig.prototype.initialise = function (options) {

  this.vitals = (options && options.vitals && options.vitals instanceof VitalSigns) ? options.vitals : new VitalSigns();

  // Standard Vitals
  this.vitals.monitor('mem', { units: 'MB' });
  this.vitals.monitor('uptime');

  if (zoologist.isInitialised()) {

    // ZooKeeper Vitals
    this.vitals.monitor({
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
    this.vitals.monitor({
      name: 'microservice',
      report: function() {
        var state = zoologist.getClient().getClient().getState().name;

        if (!zoologist.getServiceDiscovery() || !zoologist.getServiceDiscovery().getData()) {
          return {
            status: (state === 'SYNC_CONNECTED') ? 'UP' : 'DOWN'
          }
        }

        return {
          id: zoologist.getServiceDiscovery().getData().id,
          status: (state === 'SYNC_CONNECTED') ? 'UP' : 'DOWN',
          name: zoologist.getServiceInstance().getData().name,
          basePath: zoologist.getServiceInstance().basePath,
          address: zoologist.getServiceInstance().getData().address,
          port: zoologist.getServiceInstance().getData().port,
          registrationTime: new Date(zoologist.getServiceInstance().getData().registrationTimeUTC)
        }
      }
    });

    this.vitals.unhealthyWhen('zookeeper', 'status').equals("DOWN");
    this.vitals.unhealthyWhen('microservice', 'status').equals("DOWN");
  }
};

VitalSignsConfig.prototype.getVitals = function () {
  return this.vitals;
};

VitalSignsConfig.prototype.getExpress = function () {
  return this.vitals.express;
};

// Export VitalSignsConfig instance
var vitalSignsConfig = module.exports = exports = new VitalSignsConfig;
