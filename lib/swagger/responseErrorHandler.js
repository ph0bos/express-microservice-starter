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

    if (err) {

        if (typeof err !== 'object') {
            // If the object is not an Error, create a representation that appears to be
            err = {
                message: String(err) // Coerce to string
            };
        }
        else {
            // Ensure that err.message is enumerable (It is not by default)
            Object.defineProperty(err, 'message', { enumerable: true });
        }
        res.setHeader('Content-Type', 'application/json');

        // Capture Internal Server Errors
        if (!err.hasOwnProperty('code')) {

            log.error({
                status: 500,
                error: err.stack
            });

            res.status(500).json({
                name: 'Internal Server Error',
                message: 'Internal Server Error'
            });
        }
        // Capture Invalid Swagger Response Errors
        else if (err.failedValidation) {

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

    }
};