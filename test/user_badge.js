/*global describe:false, it:false, before:false, after:false, afterEach:false*/

'use strict';


var kraken = require('kraken-js'),
    express = require('express'),
    request = require('supertest'),
    spec = require('../lib/spec'),
    assert = require('assert'),
    extend = require('node.extend'),
    rawData = require('./data/dummydata.json');

describe('Location: /user/:id/badge', function () {

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
                expected = [ { name: 'Foo',
                    image: 'imfooimage',
                    id: 3,
                    date: null,
                    claimed: false,
                    claimed_date: null,
                    rule_id: 1,
                    extra: { date: null, claimed: false, claimed_date: null, rule_id: 1 } } ];

            request(mock)
                .get('/user/' + user + '/badge')
                .expect(200)
                .end(function(err, res){
                    if (err) {
                        return done(err);
                    }
                    var result = res.body;
                    console.log(result);
                    assert.deepEqual(expected, result, "Response does not match");
                    done(err);
                });
        });
    });

    describe('GET /:id', function () {
        it('should return connected item', function (done) {
            var expected = [ { name: 'Foo',
                    image: 'imfooimage',
                    id: 3,
                    date: null,
                    claimed: true,
                    claimed_date: '2014-06-06T15:00:00.000Z',
                    rule_id: 2,
                    extra:
                    { date: null,
                        claimed: true,
                        claimed_date: '2014-06-06T15:00:00.000Z',
                        rule_id: 2 } } ];
            request(mock)
                .get('/user/2/badge/' + 3)
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