'use strict';

/*
 * Dependencies
 */
var zoologist = require('../zoologist');

/**
 *  VitalSigns Health Monitor for Zoologist/Zookeeper.
 *
 * @public
 */
module.exports = {
  name: 'zookeeper',
  report: function() {
    return {
      status: (zoologist.getClient().getClient().getState().name === 'SYNC_CONNECTED') ? 'UP' : 'DOWN',
      connectionState: zoologist.getClient().getClient().getState().name,
      connecionString: zoologist.getClient().getClient().connectionManager.connectionStringParser.connectionString
    }
  }
};
