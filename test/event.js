/*global describe:false, it:false, before:false, after:false, afterEach:false*/

'use strict';


var kraken = require('kraken-js'),
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
        it('should add event', function (done) {
            var send = {
                'user_id': 1,
                'currency_id': 2
            };
            request(mock)
                .post('/event')
                .set('Accept', 'application/json')
                .expect(200)
                .send(send)
                .end(function (err, res) {
                    if (err) {
                        done(err);
                        return;
                    }
                    done(err);
                });
        });
    });
});