'use strict';

const fixtures = {
  invalidResponse: {},
  item: {
    uuid: '1234567890',
    name: 'itemName',
    count: 1,
    status: 'active',
    created: new Date('2000-01-01')
  }
};

exports.get = function get (req, res, next) {

  res.json(fixtures.item);
}


exports.post = function post (req, res, next) {

  res.status(201).json(fixtures.item);
}


exports.put = function put (req, res, next) {

  res.json(fixtures.item);
}


exports.remove = function remove (req, res, next) {

  res.status(204).end();
}


exports.list = function list (req, res, next) {

  res.json([
    fixtures.item,
    fixtures.item,
    fixtures.item
  ]);
}


exports.invalidResponse = function invalidResponse (req, res, next) {

  res.json(fixtures.invalidResponse);
}


exports.catastrophicErrorResponse = async function catastrophicErrorResponse (req, res, next) {

  try {
    throw new Error();
  }
  catch (e) {
    next(e);
  }
}
