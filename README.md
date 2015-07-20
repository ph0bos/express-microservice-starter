# Express Microservice Starter

An express-based Node.js API bootstrapping module for building microservices. Whilst the starter behaves just like a normal express middleware it actually provides a fully configured express application via sub-app mounting.

## Key Features

The starter provides the following features out of the box;

* CORS support
* Cache-Control header support
* Body-parsing support
* Configurable controller/route auto-scanning
* Automatic service registration with ZooKeeper
* Actuator info and health endpoints

## Basic Usage

The following is the most basic usage of the starter, for a more detailed example please refer to the `example` directory;

```javascript
'use strict';

var express = require('express');
var micro   = require('express-microservice-starter');

var app = express();

app.use(micro());

app.listen(8000);

```

## Configuration

By placing an `app.yml` config file in the `/config` directory of an implementing app it is possible to override default options.

```yml
default:

  #
  # Basic
  #
  server:
    port: 8000

  #
  # Microservice
  #
  microservice:
    basePath: services
    server:
      name: starter/v1

  #
  # Zookeeper
  #
  zookeeper:
    connectionString: localhost:2181
    retry:
      wait: 1000
      count: 5

```

In the above example the application would be accessible at the following address: `http://0.0.0.0:8000/starter/v1`, with the `/actuator/info` and `/actuator/health` diagmostic endpoints activated.

## API

```javascript
app.use(micro([options]));
```

`options` is an optional argument which can overwrite the defaults. It can take the following properties;

- `debug`: `boolean` Activate finer grained logging.
- `discoverable`: `boolean` Register the service with Zookeeper to allow for discovery by other services connecting to the same instance of Zookeeper.
- `vitals`: `module` Reference to an external VitalSigns compatible monitor, adds custom monitoring (for example MongoDB or Redis connectivity health checks).
