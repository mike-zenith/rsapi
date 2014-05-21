/*global describe:false, it:false, before:false, after:false, afterEach:false*/

'use strict';


var app = require('../index'),
    kraken = require('kraken-js'),
    request = require('supertest'),
    assert = require('assert'),
    extend = require('node.extend'),
    provider = require('./data/provider'),
    rawData = require('./data/dummydata.json');

describe('/badge', function () {

    var mock,
        data = extend(true, {}, rawData);

    before(function () {
        app.before = [];
        app.config = [];
        app.after = [];
        provider.load(app, data);
    });

    beforeEach(function (done) {
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
                if (err) {
                    done(err);
                    return;
                }
                assert.deepEqual(data.badge, res.body, "Response does not match");
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
            .expect(200)
            .send(newBadge)
            .end(function (err, res) {
                if (err) {
                    done(err);
                    return;
                }
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
                if (err) {
                    done(err);
                    return;
                }
                assert.deepEqual(expected, res.body, "Response does not match");
                done(err);
            });
    });

    it('PUT /badge/id should update the model', function (done) {
        var expected = extend(true, {}, data.badge[0], { name: "imchanged" });
        request(mock)
            .put('/badge/' + expected.id)
            .send(expected)
            .expect(200)
            .end(function(err, res){
                if (err) {
                    done(err);
                    return;
                }
                assert.deepEqual(expected, res.body, "Response does not match");
                done(err);
            });

    });

    it('DELETE /badge/id should remove the model', function (done) {
        var target = data.badge[0];
        request(mock)
            .del('/badge/' + target.id)
            .expect(204)
            .end(function(err, res){
                if (err) {
                    done(err);
                    return;
                }
                done(err);
            });

    });

});