'use strict';

/*
 * Dependencies
 */
var ip        = require('ip');
var zoologist = require('zoologist');

function ZoologistConfig () {
  this.initialised = false;
  this.client = null;
  this.serviceInstance = null;
  this.serviceDiscovery = null;
};

ZoologistConfig.prototype.init = function (options) {

  // Zoologist Setup
  var Zoologist               = zoologist.Zoologist;
  var ServiceDiscoveryBuilder = zoologist.ServiceDiscoveryBuilder;
  var ServiceInstanceBuilder  = zoologist.ServiceInstanceBuilder;

  // Init Zoologist Framework Client
  this.client = Zoologist.newClient(options.zookeeper.connectionString, options.zookeeper.retry.count);

  // Init Service Instance
  this.serviceInstance =
    ServiceInstanceBuilder
      .builder()
      .address(ip.address())
      .port(process.env.PORT || options.server.port)
      .name(options.serviceName)
      .build();

  // Init Service Discovery
  this.serviceDiscovery =
    ServiceDiscoveryBuilder
      .builder()
      .client(this.client)
      .thisInstance(this.serviceInstance)
      .basePath(options.serviceBasePath)
      .build();

  this.initialised = true;
}

ZoologistConfig.prototype.close = function() {
  this.client, this.serviceInstance, this.serviceDiscovery = null;
};

ZoologistConfig.prototype.getClient = function() {
  return this.client;
};

ZoologistConfig.prototype.getServiceInstance = function() {
  return this.serviceInstance;
};

ZoologistConfig.prototype.getServiceDiscovery = function() {
  return this.serviceDiscovery;
};

ZoologistConfig.prototype.isInitialised = function() {
  return this.initialised;
};

// Export ZoologistConfig instance
var zoologistConfig = module.exports = exports = new ZoologistConfig;
