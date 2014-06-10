/*global describe:false, it:false, before:false, after:false, afterEach:false*/

'use strict';


var kraken = require('kraken-js'),
    express = require('express'),
    request = require('supertest'),
    spec = require('../lib/spec'),
    assert = require('assert'),
    extend = require('node.extend');

describe('Location: /claim', function () {

    var app,
        mock;

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
        it('should claim the given badge', function (done) {
            var send = {
                    user_id: 1,
                    badge_id: 3,
                    rule_id: 1
                };

            request(mock)
                .post('/claim')
                .set('Accept', 'application/json')
                .send(send)
                .expect(200)
                .end(done);
        });
        it('should return 409 on already claimed badges', function (done) {
            var send = {
                    user_id: 2,
                    badge_id: 3,
                    rule_id: 2
                };
            request(mock)
                .post('/claim')
                .set('Accept', 'application/json')
                .send(send)
                .expect(409)
                .end(done);
        });
    });

});