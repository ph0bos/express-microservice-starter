'use strict';

var ip          = require('ip');
var address     = require('address');
var { Service } = require('consularis');

var service = new Service({ host: '127.0.0.1', port: 8500 });

class ConsularisConfig {
  constructor() {
    this.serviceDependencies = null;
  }

  registerService(serviceName) {
    const port = process.env.PORT || 8010;

    const check = {
      http: `http://${ip.address()}:${port}/${serviceName}/health`,
      interval: '5s',
      timeout: '5s',
      deregistercriticalserviceafter: '5m',
      notes: 'Health endpoint call'
    }

    return service.registerService(serviceName, ip.address(), port, 'critical', check);
  }

  deregisterService(serviceId) {
    return service.deregisterService(serviceId);
  }

  listServiceInstances() {
    service.listServiceInstances({ service: 'starter/v1', passing: true })
      .then(data => {
        console.log(data);
      })
  }
}

module.exports = new ConsularisConfig;