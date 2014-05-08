/*global describe:false, it:false, before:false, after:false, afterEach:false*/

'use strict';


var app = require('../index'),
    kraken = require('kraken-js'),
    request = require('supertest'),
    assert = require('assert'),
    data = require('./data/dummydata.json');

var testInit = function (app) {
    for(var i in data) {
        app.before.push(function (key, data) {
            return function (req, res, next) {
                var model = req.models[key];
                model.clear(function () {
                    model.create(data, function () {
                        next();
                    });
                });
            };
        }(i, data[i]));
    }
    app.before.push(function (req, res, next) {
        res.on('close', function () {
            req.db.close();
        });
        next();
    });
};

describe('/badge', function () {

    var mock;

    beforeEach(function (done) {
        testInit(app);
        kraken.create(app)
            .listen(function (err, server) {
                mock = server;
                done(err);
            });
    });


    afterEach(function (done) {
        mock.close(done);
    });

    it('GET /badge should return collection', function (done) {

        request(mock)
            .get('/badge')
            .expect(200)
            .end(function(err, res){
                var result = res.body;
                assert.deepEqual(data.badge, result, "Response does not match");
                done(err);
            });
    });

    it('POST /badge should create a new badge', function (done) {
        var newBadge = {
            "name": "heyimnew",
            "image": "yaimage.png"
        };
        request(mock)
            .post('/badge')
            .set('Content-Type', 'application/json')
            .send(newBadge)
            .end(function (err, res) {
                var result = res.body
                newBadge.id = result.id;
                assert.deepEqual(newBadge, result, "Response does not match");
                done(err);
            });
    });

    it('GET /badge/id should return the badge', function (done) {
        var expected = data.badge[0];
        request(mock)
            .get('/badge/' + expected.id)
            .expect(200)
            .end(function(err, res){
                var result = res.body;
                assert.deepEqual(expected, result, "Response does not match");
                done(err);
            });
    });

    it('PUT /badge/id should update the model', function (done) {
        var expected = data.badge[0];
        expected.name = "imchanged";
        request(mock)
            .put('/badge/' + expected.id)
            .send(expected)
            .expect(200)
            .end(function(err, res){
                var result = res.body;
                assert.deepEqual(expected, result, "Response does not match");
                done(err);
            });

    });

    it('DELETE /badge/id should remove the model', function (done) {
        var target = data.badge[0];
        request(mock)
            .del('/badge/' + target.id)
            .expect(204)
            .end(function(err, res){
                console.log(err);
                done(err);
            });

    });



});