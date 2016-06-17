# Express Microservice Starter

An express-based bootstrapping module for building microservices with Node.js. The starter utilises sub-app mounting to provide any implementing express application with a variety of functionality.

[![NPM](https://nodei.co/npm/express-microservice-starter.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/express-microservice-starter/)

## Key Features

The starter provides the following features out of the box;

* CORS support
* Cache-Control header support
* Body-parsing support
* Configurable controller/route auto-scanning
* Configurable health monitors
* Configurable per-application logging
* Automatic service registration with ZooKeeper
* Actuator info and health endpoints (/info and /health)
* Partial Response [Powered by express-partial-response](https://www.npmjs.com/package/express-partial-response)
* Request correlation id support (`res.locals.correlationId` and `req.log` Bunyan child logging also provided)

## Basic Usage

The following is the most basic usage of the starter, for a more detailed example please refer to the `example` directory;

```javascript
'use strict';

var express = require('express');
var micro   = require('express-microservice-starter');

var app = express();

app.use(micro({ discoverable: false, debug: true }));

app.listen(8000, function onListen() {
  log.info('Microservice initialised and accepting requests at the following root: http://localhost:8000/starter/v1');
});

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
  # Log
  #
  log:
    path: my-log-file.log

  #
  # Microservice
  #
  microservice:
    basePath: services
    server:
      name: starter/v1
      dependencies: my/other/service/to/monitor/v1

  #
  # Zookeeper
  #
  zookeeper:
    connectionString: localhost:2181
    retry:
      wait: 1000
      count: 5

```

In the above example the application would be accessible at the following address: `http://0.0.0.0:8000/starter/v1`, with the `/actuator/info` and `/actuator/health` diagnostic endpoints activated.

## API

```javascript
app.use(micro([options]));
```

`options` is an optional argument which can overwrite the defaults. It can take the following properties;

- `debug`: `boolean` Activate finer grained logging.
- `discoverable`: `boolean` Register the service with Zookeeper to allow for discovery by other services connecting to the same instance of Zookeeper.
- `controllersPath`: `String` Path to load controllers. Defaults to `controllers`.
- `monitorsPath`: `String` Path to load monitors. Defaults to `monitors`.
- `partialResponseQuery`: `String` The query parameter to use for partial reponse. Defaults to `fields`.
- `correlationHeaderName`: `String` The name of your correlation header. Defaults to `X-CorrelationID`.
- `enableBodyParsing`: `boolean` Enable or disable body parsing, useful to disable when dealign with content other than JSON. Defaults to `true`.
