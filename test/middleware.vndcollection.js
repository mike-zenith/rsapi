/*global describe:false, it:false, before:false, after:false, afterEach:false*/

'use strict';


var app = require('../index'),
    kraken = require('kraken-js'),
    request = require('supertest'),
    util = require('util'),
    assert = require('assert'),
    middleware = require('../lib/middleware/vndcollection'),
    extend = require('node.extend');

describe('middleware.vndcollection', function () {

    var mock;

    before(function () {

    });

    beforeEach(function (done) {
        app.before.push(middleware());
        app.config.push(function (nconf) {
            nconf.set('routes:routePath', __dirname + '/fakes/vnd.controller');
        });
        kraken.create(app)
            .listen(function (err, server) {
                mock = server;
                done(err);
            });
    });


    afterEach(function (done) {
        app.before = [];
        app.after = [];
        app.config = [];
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

                res.body = JSON.parse(res.text);
                assert.deepEqual(expected, res.body, "Response does not match");
                done(err);
            });
    });

});