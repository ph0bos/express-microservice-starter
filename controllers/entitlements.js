'use strict';

/*
 * Dependencies
 */
var optional     = require('optional');
var entitlements = optional(process.cwd() + '/config/entitlements.json');

/**
 * Initialize Entitlements endpoints
 *
 * @param app
 */
module.exports = function (router) {

  /*
   * Entitlements Endpoint
   */
  router.get('/', function (req, res, next) {
    if (!entitlements) return res.status(501).send();

    res.cacheControl({ maxAge: 3600 });
    res.json(entitlements);
  });
};
