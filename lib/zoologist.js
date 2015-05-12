'use strict';

/*
 * Dependencies
 */
var ip        = require('ip');
var zoologist = require('zoologist');

var client, serviceInstance, serviceDiscovery;

module.exports = function(options) {

  // Zoologist Setup
  var Zoologist               = zoologist.Zoologist;
  var ServiceDiscoveryBuilder = zoologist.ServiceDiscoveryBuilder;
  var ServiceInstanceBuilder  = zoologist.ServiceInstanceBuilder;

  // Init Zoologist Framework Client
  client = Zoologist.newClient(options.zookeeper.connectionString);

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

  return {
    client:           client,
    serviceInstance:  serviceInstance,
    serviceDiscovery: serviceDiscovery
  }
}

// module.exports = {
//   init:             init, 
//   client:           client,
//   serviceInstance:  serviceInstance,
//   serviceDiscovery: serviceDiscovery
// };
