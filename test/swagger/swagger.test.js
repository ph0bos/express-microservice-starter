require('mocha');
const {expect} = require('chai');
const request = require('supertest');

const {app, server} = require('./app/app');
const config = require('konfig')({ path: 'config' });

describe('express-microservice-starter swagger spec bindings', function () {

  describe('exceptions', function () {

    it('should return a 500 status if the expected response does not validate against the swagger definition', function (done) {

      request(app)
        .get('/v1/proof/invalidResponse')
        .set('Accept', 'application/json')
        .expect(function (res) {
          expect(res.body).to.deep.equal({
            name: 'InternalServerError',
            message: 'Internal Server Error'
          });
        })
        .expect(500, done);
    });

    
    it('should return a 400 bad request error if the swagger request validation fails for query parameters', function (done) {
      
      request(app)
        .get('/v1/proof?limit=fail')
        .set('Accept', 'application/json')
        .expect(function (res) {
          expect(res.body).to.deep.equal({
            "code": "INVALID_TYPE",
            "failedValidation": true,
            "path": [
              "paths",
              "/proof",
              "get",
              "parameters",
              "1"
            ],
            "paramName": "limit"
          });
        })
        .expect(400, done);
      
    });

    it('should return a 400 bad request error if the swagger request validation fails for path parameters', function (done) {

      request(app)
        .get('/v1/proof/fail')
        .set('Accept', 'application/json')
        .expect(function (res) {
          expect(res.body).to.deep.equal({
            "code": "INVALID_TYPE",
            "failedValidation": true,
            "path": [
              "paths",
              "/proof/{uuid}",
              "get",
              "parameters",
              "0"
            ],
            "paramName": "uuid"
          });
        })
        .expect(400, done);
    });

    it('should return a 400 bad request error if the swagger request validation fails for post parameters', function (done) {

      request(app)
        .post('/v1/proof')
        .send({
          name: 1,
          count: 'ten',
          status: 'unknown',
          created: 'never'
        })
        .expect(function (res) {
          expect(res.body).to.deep.equal({
            "code": "SCHEMA_VALIDATION_FAILED",
            "failedValidation": true,
            "results": {
              "errors": [
                {
                  "code": "OBJECT_MISSING_REQUIRED_PROPERTY",
                  "message": "Missing required property: userId",
                  "path": []
                },
                {
                  "code": "INVALID_FORMAT",
                  "message": "Object didn't pass validation for format date-time: never",
                  "path": [
                    "created"
                  ]
                },
                {
                  "code": "ENUM_MISMATCH",
                  "message": "No enum match for: unknown",
                  "path": [
                    "status"
                  ]
                },
                {
                  "code": "INVALID_TYPE",
                  "message": "Expected type number but found type string",
                  "path": [
                    "count"
                  ]
                },
                {
                  "code": "INVALID_TYPE",
                  "message": "Expected type string but found type integer",
                  "path": [
                    "name"
                  ]
                }
              ],
              "warnings": []
            },
            "path": [
              "paths",
              "/proof",
              "post",
              "parameters",
              "0"
            ],
            "paramName": "item"
          });
        })
        .expect(400, done);
    });

  });

  describe('exceptions fall through to application specific handlers', function () {

    it('should return a 418 status if an error handler used before swagger initialisation thrrows an exception', function (done) {
      request(app)
        .get('/v1/proof')
        .set('Accept', 'application/json')
        .set('Unauthorised', 'yes')
        .expect(function (res) {
          expect(res.body).to.deep.equal({
            name: 'Teapot',
            message: 'Always wanted to use this...'
          });
        })
        .expect(418, done);
    });


    it('should return a 418 status if the route handler throws an unexpected exception', function (done) {
      request(app)
        .get('/v1/proof/catastrophicErrorResponse')
        .set('Accept', 'application/json')
        .expect(function (res) {
          expect(res.body).to.deep.equal({
            name: 'Teapot',
            message: 'Always wanted to use this...'
          });
        })
        .expect(418, done);
    });
  });

  describe('success', function () {

    const item = {
      uuid: '1234567890',
      name: 'itemName',
      count: 1,
      status: 'active',
      created: '2000-01-01T00:00:00.000Z'
    };

    it('should return a 200 status when fetching a list of items', function (done) {

      request(app)
        .get('/v1/proof')
        .set('Accept', 'application/json')
        .expect(function (res) {
          expect(res.body).to.deep.equal([
            item, 
            item,
            item
          ]);
        })
        .expect(200, done);  

    });

    it('should return a 200 status when fetching an item', function (done) {

      request(app)
        .get('/v1/proof/1234567890')
        .set('Accept', 'application/json')
        .expect(function (res) {
          expect(res.body).to.deep.equal(item);
        })
        .expect(200, done);
    });


    it('should return a 201 status when creating an item', function (done) {

      request(app)
        .post('/v1/proof')
        .set('Accept', 'application/json')
        .send({
          name: 'itemName',
          count: 1,
          status: 'active',
          created: new Date('2000-01-01'),
          userId: 1
        })
        .expect(function (res) {
          expect(res.body).to.deep.equal(item);
        })
        .expect(201, done);
    });

    it('should return a 200 status when updating an item', function (done) {

      request(app)
        .put('/v1/proof/1234567890')
        .set('Accept', 'application/json')
        .send(item)
        .expect(function (res) {
          expect(res.body).to.deep.equal(item);
        })
        .expect(200, done);
    });

    it('should return a 204 status when deleting an item', function (done) {

      request(app)
        .del('/v1/proof/1234567890')
        .set('Accept', 'application/json')
        .send(item)
        .expect(204, done);
    });

  });

}); 
