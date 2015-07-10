'use strict';

/**
 * Hello Controller
 */
module.exports = function (router) {
  router.get('/', function (req, res, next) {
    res.json({
      "message": "Hello"
    });
  });
};