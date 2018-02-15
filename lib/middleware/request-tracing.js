const ip = require('request-ip');

/**
 * Middleware to Log Request Detail
 */
module.exports = function(req, res, next) {

  var meta = {
    request: {
      client: {ip: ip.getClientIp(req)},
      method: req.method,
      path: req.originalUrl,
      headers: req.headers
    }
  };

  req.log.info(meta, 'Request Trace');
  next();
};
