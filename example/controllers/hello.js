'use strict';

var util = require('util');

/**
 * Hello Controller
 */
module.exports = function (router) {

  /**
   * Sample GET
   */
  router.get('/', function (req, res, next) {
    res.json({
      "message": "Hello"
    });
  });

  /**
   * Sample GET with validation
   */
  router.get('/is/it/me/youre/looking/for', function (req, res, next) {
    req.checkQuery('limit', 'Invalid limit parameter').optional().isInt();

    var errors = req.validationErrors();

    if (errors) {
      return res.status(400).json(errors);
    }

    res.json({
      "message": "Hello Lionel"
    });
  });
};
