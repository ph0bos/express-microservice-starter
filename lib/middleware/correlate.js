'use strict';

var uuid = require('node-uuid');

/**
 * Correlation Header Middleware
 *
 * @param options
 */
module.exports = function (options) {
  options = options || {};

  var CORRELATION_ID_HEADER = options.correlationHeaderName || 'X-CorrelationID';

  return function (req, res, next) {
    var id = (req.header(CORRELATION_ID_HEADER)) ? req.header(CORRELATION_ID_HEADER) : uuid.v4();
    res.header(CORRELATION_ID_HEADER, id);
    next();
  };
};
