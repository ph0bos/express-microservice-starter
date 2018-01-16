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
module.exports = function requestErrorHandler (err, req, res, next) {

  // Capture Invalid Swagger Response Errors
  if (err && err.failedValidation && err.code) {

    log.error({
      status: 500,
      code: err.code,
      error: err.results
    });

    res.status(500).json({
      name: 'Internal Server Error',
      message: 'Internal Server Error'
    });

  }
  else {
    next(err);
  }
};
