# Express Microservice Starter

An express-based Node.js API bootstrapping module for building microservices. Whilst the starter behaves just like a normal express middleware it actually provides a fully configured express application.

## Key Features

The starter provides the following features out of the box;

* CORS support
* Cache-Control header support
* Body-parsing support
* Configurable controller/route auto-scanning
* ZooKeeper autoregistration
* Actuator info and health endpoints

## Basic Usage 

The following is the most basic usage of the starter;

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
