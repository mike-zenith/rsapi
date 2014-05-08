/*global describe:false, it:false, before:false, after:false, afterEach:false*/

'use strict';


var app = require('../index'),
    kraken = require('kraken-js'),
    request = require('supertest'),
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
        res.on('end', function () {
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

    it('should return collection', function (done) {

        request(mock)
            .get('/badge')
            .expect(200)
            .end(function(err, res){
                console.log(res.body, res.headers);
                done(err);
            });
    });

});