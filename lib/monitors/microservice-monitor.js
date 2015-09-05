'use strict';

/*
 * Dependencies
 */
var Promise  = require('bluebird').Promise;
var async    = require('async');
var zoologist = require('../zoologist');

var CHECK_INTERVAL_MS = 5000;

/**
 *  VitalSigns Health Monitor for a Microservice.
 *
 * @public
 */
 module.exports = {
   name: 'microservice',
   report: function() {
     return svcHealth;
   },
   destroy: function() {
     clearInterval(interval);
   }
 };

var svcHealth = null;

/**
 * Peridically check the health of the microservice.
 */
var interval = setInterval(function() {
  var check = checkMicroserviceHealth()

  if (check) {
    check.then(function (health) {
      svcHealth = health;
    });
  }
}, CHECK_INTERVAL_MS);

/**
 * Invoke health check.
 */
function checkMicroserviceHealth() {
  var resolver = Promise.pending();

  if (!zoologist.getServiceDiscovery() || !zoologist.getServiceDiscovery().getData()) {
    resolver.resolve({
      status: (zoologist.getClient().getClient().getState().name === 'SYNC_CONNECTED') ? 'UP' : 'DOWN'
    });

    return resolver.promise;
  }

  var health = {
    id: zoologist.getServiceDiscovery().getData().id,
    status: (zoologist.getClient().getClient().getState().name === 'SYNC_CONNECTED') ? 'UP' : 'DOWN',
    name: zoologist.getServiceInstance().getData().name,
    basePath: zoologist.getServiceInstance().getData().basePath,
    address: zoologist.getServiceInstance().getData().address,
    port: zoologist.getServiceInstance().getData().port,
    registrationTime: new Date(zoologist.getServiceInstance().getData().registrationTimeUTC)
  };

  if (zoologist.getServiceDependencies() && zoologist.getServiceDependencies().length > 0) {
    checkDependencies(zoologist.getServiceDependencies(), function(err, dependencies) {
      health.dependencies = dependencies;

      // If any dependencies have zero count, set service 'DOWN'
      Object.keys(dependencies).forEach(function(dependency) {
        if (dependencies[dependency] == 0) health.status = 'DOWN';
      });

      resolver.resolve(health);
    });
  } else {
    resolver.resolve(health);
  }

  return resolver.promise;
}

/**
 * Check the the status of any dependencies of this service.
 */
function checkDependencies(dependencies, callback) {
  var checkedDependencies = {};

  async.each(dependencies, function (dependency, callback) {
    zoologist.getServiceDiscovery().queryForInstances(dependency, function(err, instances) {
      checkedDependencies[dependency] = ((instances) ? instances.length : 0);
      callback(err);
    });
  }, function(err) {
    // Ignore error and just return zero'd counts
    callback(null, checkedDependencies);
  });
};
