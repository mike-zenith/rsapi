/*global describe:false, it:false, before:false, after:false, afterEach:false*/


var kraken = require('kraken-js'),
    express = require('express'),
    request = require('supertest'),
    assert = require('assert');

describe('#lib/controller/restful', function () {

    var app,
        mock;


    before(function () {

    });

    beforeEach(function (done) {
        app = express();
        app.on('start', done);
        app.use(kraken({
            basedir: process.cwd(),
            onconfig: function (config, next) {
                var dir = {directory: '../../../../test/fakes/generator'};
                config.set("middleware:router:module:arguments", [dir]);

                next(null, config);
            }
        }));

        mock = app.listen(1337);
    });

    afterEach(function (done) {
        mock.close(done);
    });

    it('GET /1 should be present', function (done) {
        request(mock)
            .get('/1')
            .expect(200)
            .end(done);
    });

    it('GET /2 should overwrite generated routes', function (done) {
        request(mock)
            .get('/2')
            .expect(200)
            .end(done);
    });

});