'use strict';

var log = require('../logger');

/**
 * Swagger request validation middleware
 *
 * @param err
 * @param req
 * @param res
 * @param next
 */
module.exports = function requestErrorHandler(err, req, res, next) {

  if (err) {

    // Capture Invalid Swagger Request Errors
    if (err.failedValidation && err.code) {

      log.error({
        status: 400,
        code: err.code,
        error: err.results
      });

      res.status(400).json(err);

    }
    else {

      next(err);

    }

  }

};
