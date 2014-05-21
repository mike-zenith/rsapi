/*global describe:false, it:false, before:false, after:false, afterEach:false*/

'use strict';


var app = require('../index'),
    kraken = require('kraken-js'),
    request = require('supertest'),
    assert = require('assert'),
    extend = require('node.extend'),
    provider = require('./data/provider'),
    rawData = require('./data/dummydata.json');

describe('/user/x/currency[/y]', function () {

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

    it('GET /user/x/currency should return collection', function (done) {
        var user = data.user[0].id,
            currencies = [ data.user_currencies[0], data.user_currencies[1] ];
        request(mock)
            .get('/user/' + user + '/currency')
            .expect(200)
            .end(function(err, res){
                debugger;
                var result = res.body;
                assert.deepEqual(currencies, result, "Response does not match");
                done(err);
            });
    });

    it('GET /user/x/currency/y should return connected currency', function (done) {
        var user = data.user_currencies[0].user_id,
            currency = data.user_currencies[0].currencies_id;
        request(mock)
            .get('/user/' + user + '/currency/' + currency)
            .expect(200)
            .end(function(err, res){
                var result = res.body;
                assert.deepEqual({}, result, "Response does not match");
                done(err);
            });
    });



});