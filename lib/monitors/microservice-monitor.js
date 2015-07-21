'use strict';

/*
 * Dependencies
 */
var zoologist = require('../zoologist');

/**
 *  VitalSigns Health Monitor for a Microservice.
 *
 * @public
 */
module.exports = {
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
};
