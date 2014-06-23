/*global describe:false, it:false, before:false, after:false, afterEach:false*/

'use strict';


var kraken = require('kraken-js'),
    express = require('express'),
    request = require('supertest'),
    spec = require('../lib/spec'),
    assert = require('assert'),
    extend = require('node.extend'),
    rawData = require('./data/dummydata.json');

describe('Location: /user', function () {

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

    describe.only('GET', function () {
        it('should return collection', function (done) {
            request(mock)
                .get('/user')
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

    describe('GET /:id', function () {
        it('should return the user', function (done) {
            var expected = data.user[0];
            request(mock)
                .get('/user/' + expected.id)
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

});