'use strict';

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

app.use(micro(options));

const server = app.listen(PORT);

module.exports = {app, server};
