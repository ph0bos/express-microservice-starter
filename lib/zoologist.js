'use strict';

/*
 * Dependencies
 */
var EventEmitter = require('events').EventEmitter;
var util         = require('util');
var ip           = require('ip');
var zoologist    = require('zoologist');
var log          = require('bunyan').createLogger({ name: 'microservice:zoologist' });

// Inherit from EventEmitter
util.inherits(ZoologistConfig, EventEmitter);

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
  this.client.start();

  this.initialised = true;

  var self = this;

  this.client.on('connected', function () {
    log.info('zookeeper connected');

    if (self.isRegisteredService()) {
      var svcId = self.serviceDiscovery.getData().id;

      self.serviceDiscovery.unRegisterService(svcId, function (err) {
        log.info({ id: svcId }, 'unregistered expired service');
      });
    }

    // Init Service Instance
    self.serviceInstance =
      ServiceInstanceBuilder
        .builder()
        .address(ip.address())
        .port(process.env.PORT || options.server.port)
        .name(options.serviceName)
        .build();

    // Init Service Discovery
    self.serviceDiscovery =
      ServiceDiscoveryBuilder
        .builder()
        .client(self.client)
        .thisInstance(self.serviceInstance)
        .basePath(options.serviceBasePath)
        .build();

    self.emit('ready');
  });

  this.client.on('disconnected', function () {
    log.warn('zookeeper disconnected');
  });
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

ZoologistConfig.prototype.isRegisteredService = function() {
  return (this.getServiceDiscovery() && this.getServiceDiscovery().getData()) ? true : false;
};

// Export ZoologistConfig instance
var zoologistConfig = module.exports = exports = new ZoologistConfig;
