/*global describe:false, it:false, before:false, after:false, afterEach:false*/

var kraken = require('kraken-js'),
    express = require('express'),
    request = require('supertest'),
    spec = require('../../lib/spec'),
    assert = require('assert'),
    extend = require('node.extend'),
    middleware = require('../../lib/middleware/vndcollection')


describe('#lib/middleware/vndcollection', function () {

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
                var dir = {directory: '../../../../test/fakes/vnd.controller'};
                config.set("middleware:router:module:arguments", [dir]);

                next(null, config);
            }
        }));

        mock = app.listen(1337);
    });


    afterEach(function (done) {
        mock.close(done);
    });

    it('GET / should use middleware', function (done) {
        request(mock)
            .get('/')
            .set('Accept', 'application/vnd.collection+json')
            .expect(200)
            .end(function(err, res) {
                var expected = {
                    collection : {
                        version: "1.2",
                        href: "http://vnd.controller",
                        links: [],
                        items: [
                            {
                                href: "http://vnd.controller/bar",
                                data: [
                                    { name: "foo", value: "bar", prompt: "foo"}
                                ],
                                links: []
                            }
                        ],
                        queries: [],
                        template: {
                            data: [
                                { name: "foo", value: "", prompt: "foo"}
                            ]
                        }
                    }
                };
                if (err) {
                    return done(err);
                }
                res.body = JSON.parse(res.text);
                assert.deepEqual(expected, res.body, "Response does not match");
                done(err);
            });
    });

    it('GET /1 should fill href, version when not given', function (done) {
        request(mock)
            .get('/1')
            .set('Accept', 'application/vnd.collection+json')
            .expect(200)
            .end(function(err, res) {
                if (err) {
                    return done(err);
                }
                res.body = JSON.parse(res.text);
                assert.ok(res.body.collection.version, "Response does not contain version");
                assert.ok(res.body.collection.href, "Response does not contain href");
                done(err);
            });
    });

    it('GET /2 should populate items', function (done) {
        request(mock)
            .get('/2')
            .set('Accept', 'application/vnd.collection+json')
            .expect(200)
            .end(function(err, res) {
                var expected = {
                    collection : {
                        href: "http://127.0.0.1:1337/2",
                        links: [],
                        items: [
                            {
                                href: "http://127.0.0.1:1337/2/bar",
                                data: [
                                    { name: "foo", value: "bar", prompt: "foo"}
                                ],
                                links: []
                            }
                        ],
                        queries: [],
                        template: {
                            data: [
                                { name: "foo", value: "", prompt: "foo"}
                            ]
                        }
                    }
                };
                if (err) {
                    return done(err);
                }
                res.body = JSON.parse(res.text);
                // remove version, it comes from a config value
                delete res.body.collection.version;
                assert.deepEqual(expected, res.body, "Response does not match");
                done(err);
            });
    });


});