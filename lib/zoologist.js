'use strict';

/*
 * Dependencies
 */
var EventEmitter = require('events').EventEmitter;
var util         = require('util');
var ip           = require('ip');
var address      = require('address');
var zoologist    = require('zoologist');
var log          = require('./logger');

// Inherit from EventEmitter
util.inherits(ZoologistConfig, EventEmitter);

/**
 * Create an instance of ZoologistConfig.
 *
 * @public
 * @constructor
 */
function ZoologistConfig() {
  this.initialised = false;
  this.client = null;
  this.serviceInstance = null;
  this.serviceDiscovery = null;
  this.serviceDependencies = null;
};

/**
 * Initialise ZoologistConfig
 *
 * @public
 * @method init
 */
ZoologistConfig.prototype.initialise = function(options) {
  // Zoologist Setup
  var Zoologist               = zoologist.Zoologist;
  var ServiceDiscoveryBuilder = zoologist.ServiceDiscoveryBuilder;
  var ServiceInstanceBuilder  = zoologist.ServiceInstanceBuilder;

  // Init Zoologist Framework Client
  this.options = options;
  this.client = Zoologist.newClient(options.zookeeper.connectionString, options.zookeeper.retry.count, options.zookeeper.retry.wait, options.zookeeper.connectTimeout, options.zookeeper.sessionTimeout);
  this.client.start();

  this.serviceDependencies = options.serviceDependencies;

  this.initialised = true;

  var self = this;

  this.client.on('connected', function() {
    log.info('zookeeper connected');

    if (self.isRegisteredService()) {
      var svcId = self.serviceDiscovery.getData().id;

      self.serviceDiscovery.unRegisterService(svcId, function(err) {
        if (options.debug) {
          log.info({ id: svcId }, 'unregistered expired service');
        }
      });
    }

    // Init Service Instance
    self.serviceInstance =
      ServiceInstanceBuilder
        .builder()
        .address(process.env.ADVERTISED_HOST || self.getIpAddress())
        .port(process.env.ADVERTISED_PORT || process.env.PORT || options.server.port)
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

  this.client.on('disconnected', function() {
    self.emit('disconnected');
    log.warn('zookeeper disconnected');
  });

  this.client.on('error', function(err) {
    self.emit('error', err);
    log.warn('zookeeper error');
  });
}

/**
 * Close the Zoologist framework.
 *
 * @public
 * @method close
 */
ZoologistConfig.prototype.close = function() {
  this.client, this.serviceInstance, this.serviceDiscovery = null;
};

/**
 * Close the Zoologist framework.
 *
 * @public
 * @method getClient
 */
ZoologistConfig.prototype.getClient = function() {
  return this.client;
};

/**
 * Return the Service Instance framework.
 *
 * @public
 * @method getServiceInstance
 */
ZoologistConfig.prototype.getServiceInstance = function() {
  return this.serviceInstance;
};

/**
 * Return the Service Discovery framework.
 *
 * @public
 * @method getServiceDiscovery
 */
ZoologistConfig.prototype.getServiceDiscovery = function() {
  return this.serviceDiscovery;
};

/**
 * Determine if the framework has been initialised.
 *
 * @public
 * @method isInitialised
 */
ZoologistConfig.prototype.isInitialised = function() {
  return this.initialised;
};

/**
 * Determine if a service has been registered.
 *
 * @public
 * @method isRegisteredService
 */
ZoologistConfig.prototype.isRegisteredService = function() {
  return (this.getServiceDiscovery() && this.getServiceDiscovery().getData()) ? true : false;
};

/**
 * Return a list of service dependencies.
 *
 * @public
 * @method getServiceDependencies
 */
ZoologistConfig.prototype.getServiceDependencies = function() {
  return this.serviceDependencies;
};

ZoologistConfig.prototype.getIpAddress = function () {
  if (this.options.networkInterfaces && this.options.networkInterfaces.length > 0) {
   for (var i = 0, len = this.options.networkInterfaces.length; i < len; i++) {
     var ipAddress = address.ip(this.options.networkInterfaces[i]);
     if (ipAddress) {
       log.warn('Registration IP address [' + ipAddress + '] found using configured network interface [' + this.options.networkInterfaces[i] + ']');
       return ipAddress;
     }
   }

   log.warn('Registration IP address not found using configured network interfaces, will attempt to use default');
  }

  return ip.address();
};

module.exports = new ZoologistConfig;
