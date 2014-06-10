/*global describe:false, it:false, before:false, after:false, afterEach:false*/

'use strict';


var kraken = require('kraken-js'),
    util = require('util'),
    express = require('express'),
    request = require('supertest'),
    spec = require('../lib/spec'),
    assert = require('assert'),
    extend = require('node.extend');

describe('Location: /event', function () {

    var app,
        mock;

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

    describe('POST', function () {
        it('should run without errors', function (done) {
            var send = {
                'user_id': 1,
                'currency_id': 3
            };
            request(mock)
                .post('/event')
                .set('Accept', 'application/json')
                .expect(200)
                .send(send)
                .end(done);
        });

        it('should add Badge depending on the Rules', function (done) {
            var send = {
                'user_id': 2,
                'currency_id': 1,
                'value': 2
            };
            request(mock)
                .post('/event')
                .set('Accept', 'application/json')
                .expect(200)
                .send(send)
                .end(function (err, res) {
                    if (err) {
                        return done(err);
                    }
                    assert.equal(res.body.earned, 1, 'Did not add badge');
                    done();
                });
        });

        it('should create new user and add currency when not found', function (done) {
            var send = {
                'user_id': 999,
                'currency_id': 3
            };
            request(mock)
                .post('/event')
                .set('Accept', 'application/json')
                .expect(200)
                .send(send)
                .end(done);
        });

        it('should give 404 when currency not found', function (done) {
            var send = {
                'user_id': 1,
                'currency_id': 9999
            };
            request(mock)
                .post('/event')
                .set('Accept', 'application/json')
                .expect(404)
                .send(send)
                .end(done);

        });

        it('should give 404 when currency and user not found', function (done) {
            var send = {
                'user_id': 9123,
                'currency_id': 9999
            };
            request(mock)
                .post('/event')
                .set('Accept', 'application/json')
                .expect(404)
                .send(send)
                .end(done);

        });

        it.only('should add connected missing currency to the user and credit badges', function (done) {
            var send = {
                'user_id': 1,
                'currency_id': 3,
                'value': 200
            };
            request(mock)
                .post('/event')
                .set('Accept', 'application/json')
                .expect(200)
                .send(send)
                .end(function (err, res) {
                    if (err) {
                        return done(err);
                    }
                    assert.equal(res.body.earned, 1, 'Did not credit the badge');
                    done(err);
                });
        });

    });
});