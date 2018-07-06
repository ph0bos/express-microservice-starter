'use strict';

const mock = require('mock-require');

mock('konfig', () => ({
  "app": {
    "server": {
      "port": 8002
    },
    "microservice": {
      "basePath": "services",
      "server": {
        "name": "project"
      }
    },
  }
}));

const config = require('konfig')({ path: 'config' });
const express = require('express');
const micro = require('../../../index');

const PORT = process.env.PORT || config.app.server.port;

const options = {
  discoverable: false,
  swaggerConfig: {
    filePath: `${process.cwd()}/test/swagger/app/swagger.yml`,
    controllers: `${process.cwd()}/test/swagger/app/lib/controllers`
  },
  correlationHeaderName: 'X-Unity-CorrelationID'
};

const app = express();

app.use(function (req, res, next) {

  if (req.headers.unauthorised) {
    
    next(new Error());

  }
  else {

    next();

  }

});

app.use(micro(options));

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


const server = app.listen(PORT);

module.exports = {app, server};
