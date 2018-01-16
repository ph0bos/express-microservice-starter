'use strict';

/*
 * Dependencies
 */
var fs = require('fs');
var yaml = require('js-yaml');
var path = require('path');
var swagger = require('swagger-tools');

var log = require('../logger');
var requestErrorHandler = require('./requestErrorHandler');
var responseErrorHandler = require('./responseErrorHandler');

/**
 * Swagger binds the swagger doc to route handlers, sets up validation, and UI
 *
 * @param app
 * @param options
 */
module.exports = function initSwagger (app, options) {

  try {
    // Implementor swagger defined routes
    var swaggerDoc = yaml.safeLoad(fs.readFileSync(path.resolve(options.callerPath, options.swaggerConfig.filePath)));

    swagger.initializeMiddleware(swaggerDoc, function (middleware) {

      // Interpret Swagger resources and attach metadata to request - must be first in swagger-tools middleware chain
      app.use(middleware.swaggerMetadata());

      // Validate Swagger requests
      app.use(middleware.swaggerValidator({
        validateResponse: true
      }));
      
      //  Custom error handler to convert swagger request errors into API friendly json variants
      app.use(requestErrorHandler);

      // Route validated requests to appropriate controller
      app.use(middleware.swaggerRouter({
        controllers: options.swaggerConfig.controllers
      }));

      //  Custom error handler to convert swagger standard application/html response errors into API friendly json variants
      app.use(responseErrorHandler);

      // Serve the Swagger documents and Swagger UI
      app.use(middleware.swaggerUi());

      app.emit('swagger:routes:registered');
    });

  } catch (e) {
    log.error(e, 'Error bootstrapping swagger router');
  }
  
}