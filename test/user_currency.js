/*global describe:false, it:false, before:false, after:false, afterEach:false*/

'use strict';


var kraken = require('kraken-js'),
    express = require('express'),
    request = require('supertest'),
    spec = require('../lib/spec'),
    assert = require('assert'),
    extend = require('node.extend'),
    rawData = require('./data/dummydata.json');

describe('Location: /user/:id/currency', function () {

    var app,
        mock,
        data = extend(true, {}, rawData);

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
        it('should return collection segment', function (done) {
            var user = data.user[0].id,
                expected = [
                    {
                        name: 'imdisabled',
                        type: 2,
                        disabled: true,
                        id: 2,
                        value: 100,
                        extra: { value: 100 } },
                    { name: 'logins',
                        type: 2,
                        disabled: false,
                        id: 3,
                        value: 2,
                        extra: { value: 2 } } ];
            request(mock)
                .get('/user/' + user + '/currency')
                .expect(200)
                .end(function(err, res){
                    if (err) {
                        return done(err);
                    }
                    var result = res.body;
                    assert.deepEqual(expected, result, "Response does not match");
                    done(err);
                });
        });
    });

    describe('GET /:id', function () {
        it('should return connected item', function (done) {
            var user = data.user_currencies[0].user_id,
                expected = [ { name: 'imdisabled',
                    type: 2,
                    disabled: true,
                    id: 2,
                    value: 100,
                    extra: { value: 100 } } ];
            request(mock)
                .get('/user/' + user + '/currency/' + 2)
                .expect(200)
                .end(function(err, res){
                    if (err) {
                        return done(err);
                    }
                    var result = res.body;
                    assert.deepEqual(expected, result, "Response does not match");
                    done(err);
                });
        });
    });

});