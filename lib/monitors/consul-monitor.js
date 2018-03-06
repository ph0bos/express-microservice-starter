'use strict';

/*
 * Dependencies
 */
var consularis = require('../service-registration/consularis');

var interval = setInterval(function() {
  var check = _check()
}, 5000);

function _check () {
  // Does consul have my current service ID and is it passing?
  consularis.listServiceInstances();
}

/**
 *  VitalSigns Health Monitor for Consularis/Consul.
 *
 * @public
 */
module.exports = {
  name: 'consul',
  report: function() {
    return {
      status: 'UP'
      // status: (zoologist.getClient().getClient().getState().name === 'SYNC_CONNECTED') ? 'UP' : 'DOWN',
      // connectionState: zoologist.getClient().getClient().getState().name,
      // connectionString: zoologist.getClient().getClient().connectionManager.connectionStringParser.connectionString
    }
  },
  destroy: function() {
    clearInterval(interval);
  }
};
