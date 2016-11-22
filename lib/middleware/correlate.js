'use strict';

var uuid = require('uuid');
var log  = require('../logger');

/**
 * Correlation Header Middleware
 *
 * @param options
 */
module.exports = function (options) {
  options = options || {};

  var CORRELATION_ID_HEADER = options.headerName || 'X-CorrelationID';

  return function correlate(req, res, next) {
    var id = (req.header(CORRELATION_ID_HEADER)) ? req.header(CORRELATION_ID_HEADER) : uuid.v4();
    res.locals.correlationId = id;
    res.set(CORRELATION_ID_HEADER, id);
    req.log = log.child({ correlationId: id }, true);
    req.log.debug('sss');
    next();
  };
};
