/*global describe:false, it:false, before:false, after:false, afterEach:false*/

'use strict';


var kraken = require('kraken-js'),
    express = require('express'),
    request = require('supertest'),
    spec = require('../lib/spec'),
    assert = require('assert'),
    extend = require('node.extend'),
    rawData = require('./data/dummydata.json');

describe('Location: /badge', function () {

    var app,
        mock,
        data = extend(true, {}, rawData);

    before(function () {

    });

    beforeEach(function (done) {
        app = express();
        app.on('start', done);
        app.use(kraken({
            basedir: process.cwd(),
            onconfig: spec(app).onconfig
        }));

        mock = app.listen(1337);
    });


    afterEach(function (done) {
        mock.close(done);
    });

    describe('GET', function () {
        it('should return collection', function (done) {
            request(mock)
                .get('/badge')
                .set('Accept', 'application/json')
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
    });

    describe('POST', function () {
        it('should create a new badge', function (done) {
            var newBadge = {
                "name": "heyimnew",
                "image": "yaimage.png"
            };
            request(mock)
                .post('/badge')
                .set('Accept', 'application/json')
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
    });

    describe('GET /:id', function () {
        it('should return the badge', function (done) {
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
    });

    describe('PUT /:id', function () {
        it('update the model', function (done) {
            var expected = extend(true, {}, data.badge[0], { name: "imchanged" });
            request(mock)
                .put('/badge/' + expected.id)
                .set('Accept', 'application/json')
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
    });

    describe('DELETE /:id', function () {
        it('should remove the model', function (done) {
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

});