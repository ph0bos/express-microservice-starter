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

```
'use strict';

var express = require('express');
var micro   = require('express-microservice-starter');

var app = express();

app.use(micro());

app.listen(8000);

```
