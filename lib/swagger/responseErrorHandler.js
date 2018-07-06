'use strict';

var log = require('../logger');

/**
 * Swagger response validation middleware
 *
 * @param err
 * @param req
 * @param res
 * @param next
 */
module.exports = function responseErrorHandler(err, req, res, next) {

  if (err) {

    // Capture Invalid Swagger Response Errors
    if (err.failedValidation && err.code) {

      log.error({
        status: 500,
        code: err.code,
        error: err.results
      });

      res.status(500).json({
        name: 'InternalServerError',
        message: 'Internal Server Error'
      });

    }
    else {

      next(err);

    }
  }
};
