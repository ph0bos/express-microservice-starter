'use strict';

/*
 * Dependencies
 */
var ip        = require('ip');
var zoologist = require('zoologist');

var client, serviceInstance, serviceDiscovery;

var init = function(options) {
  // Zoologist Setup
  var Zoologist               = zoologist.Zoologist;
  var ServiceDiscoveryBuilder = zoologist.ServiceDiscoveryBuilder;
  var ServiceInstanceBuilder  = zoologist.ServiceInstanceBuilder;

  // Init Zoologist Framework Client
  client = Zoologist.newClient(options.zookeeper.connectionString, options.zookeeper.retry.count);

  // Init Service Instance
  serviceInstance = 
    ServiceInstanceBuilder
      .builder()
      .address(ip.address())
      .port(process.env.PORT || options.server.port)
      .name(options.serviceName)
      .build();

  // Init Service Discovery
  serviceDiscovery = 
    ServiceDiscoveryBuilder
      .builder()
      .client(client)
      .thisInstance(serviceInstance)
      .basePath(options.serviceBasePath)
      .build();
}

var close = function() {
  client, serviceInstance, serviceDiscovery = null;
};

var getClient = function() {
  return client;
};

var getServiceInstance = function() {
  return serviceInstance;
};

var getServiceDiscovery = function() {
  return serviceDiscovery;
};

module.exports = function() {
  return {
    init:                init, 
    close:               close,
    getClient:           getClient,
    getServiceInstance:  getServiceInstance,
    getServiceDiscovery: getServiceDiscovery
  }
}
