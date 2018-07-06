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

app.on('service:registered', function(data) {
  log.info('service registered with zookeeper', data);
  log.info('microservice registration data is also available as an app.locals property', app.locals.microservice);
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
      registrationNetworkInterfacePriority: 
        - en0
        - lo0

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

Note: the `registrationNetworkInterfacePriority` property allows the selection of the network interface when dynamically registering a service with ZooKeeper.

If you would like to override the version which is exposed in the /info endpoint, just set the VERSION node env variable.

```sh
VERSION=1.0.1 node index.js
```

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
- `validatorOptions`: `object` Enable express-validator with these options. Defaults to `null`.
- `enableBodyParsing`: `boolean` Enable or disable body parsing, useful to disable when dealing with content other than JSON. Enables express-validator. Defaults to `true`.
- `enableEtag`: `boolean` Activate etag. Defaults to `false`.
- `enableRequestTracing`: `boolean` Enabled request log trace. Defaults to `false`.

## SWAGGER Integration

Supports binding of route handlers using a swagger specification document via the options.swaggerConfig object.

### app.js

```javascript
'use strict';

var express = require('express');
var micro   = require('express-microservice-starter');

var app = express();

var options = {
  swaggerConfig: {
    filePath: `/swagger.yml`, // path to swagger specification file
    controllers: `lib/controllers` // path to controllers directory
  }
};

app.use(micro(options));

//  to register application specific exception handlers wait until the
//  'swagger:routes:registered' event is emitted.
app.once('swagger:routes:registered', () => {

  app.use(function (err, req, res, next) {
  
    if (err) {
      res.status(418).json({
        name: 'Teapot',
        message: 'Always wanted to use this...'
      });
    }
  });
});

app.listen(8000, function onListen() {
  log.info('Microservice initialised and accepting requests at the following root: http://localhost:8000/starter/v1');
});

```

### swagger.yml

```yaml

swagger: "2.0"
info:
  version: 1.0.0
  title: "API specification"
  description: API specification
basePath: /v1
schemes:
  - http
consumes:
  - application/json
produces:
  - application/json
paths:
  /users:
    x-swagger-router-controller: users # lib/controllers/users
    get:
      description: Return a list of users
      operationId: find
      responses:
        200:
          description: User Response
          schema:
            type: array
            items:
              $ref: '#/definitions/User'
        default:
          description: Standard Error Response
          schema:
            $ref: '#/definitions/Error'

  /users/{uuid}:
    x-swagger-router-controller: users # lib/controllers/users
    get:
      description: Return a user based on the provided uuid
      operationId: get
      parameters:
        - name: uuid
          in: path
          description: UUID of the user to return
          required: true
          type: integer
          format: int64
      responses:
        200:
          description: Item Response
          schema:
            $ref: '#/definitions/User'
        default:
          description: Standard Error Response
          schema:
            $ref: '#/definitions/Error'


definitions:
  User:
    required:
      - uuid
      - name
      - status
      - created
    properties:
      uuid:
        type: string
      name:
        type: string
      status:
        type: string
        enum:
          - active
          - inactive
      created:
          type: string
          format: date-time

```

### lib/controllers/users.js

```javascript

'use strict';

const user = {
  uuid: '1234567890',
  name: 'User One',
  status: 'active',
  created: new Date('2000-01-01')
};

exports.find = function find (req, res, next) {

  try {
    res.json([user]);
  }
  catch (e) {
    next(e);
  }
}

exports.get = function get (req, res, next) {

  try {
    res.json(user);
  }
  catch (e) {
    next(e);
  }
}

```
