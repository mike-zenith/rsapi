/*global describe:false, it:false, before:false, after:false, afterEach:false*/

'use strict';


var assert = require('assert'),
    extend = require('node.extend'),
    util = require('util'),
    diff = require('deep-diff'),

    service = require('../../lib/service/vndcollection'),
    orm = require('orm'),
    q = require('q');

describe('#lib/service/vndcollection', function () {

    var mock, conn, connDfd;

    before(function () {
        conn = function () {
            if (connDfd) {
                return connDfd.promise;
            }
            connDfd = q.defer();
            orm.connect('sqlite://?type=memory', function (err, db) {
                connDfd[err ? 'reject' : 'resolve'](err || db);
            });
            return connDfd.promise;
        };
    });

    beforeEach(function (done) {
        connDfd = null;
        mock = new service();
        done();
    });


    afterEach(function (done) {
        if (connDfd) {
            conn().done(function (db) {
                db.close();
                done();
            });
        } else {
            done();
        }

    });

    it('.skeleton: generate vnd.collection skeleton (wo opts)', function (done) {
        var test = {
            "collection": {
                "version": "1.0",
                "href": "http://href",
                "links": [],
                "items": [],

                "queries": [],
                "template": []
            }
        };

        assert.deepEqual(test, mock.skeleton());
        done();
    });

    it('.skeleton: uses options', function (done) {
        var options = {
                "version": "1.2",
                "href": "http://jani"
            },
            test = {
                "collection": {
                    "version": "1.2",
                    "href": "http://jani",
                    "links": [],
                    "items": [],

                    "queries": [],
                    "template": []
                }
            };

        assert.deepEqual(test, mock.skeleton(options));
        done();
    });

    it('.itemSkeleton : generates item skeleton w item-data opts', function (done) {
        var test = {
                "href": "http://1",
                "data": [
                    {"name": "name", value: "nicebadge", prompt: "name"},
                    {"name": "image", value: "nop", prompt: "image"},
                    {"name": "id", value: 1, prompt: "id"}
                ],
                "links": []
            },
            opts = {
                "name": "nicebadge",
                "image": "nop",
                "id": 1
            };

        assert.deepEqual(test, mock.itemSkeleton(opts));
        done();
    });

    it('.itemSkeleton : generates item skeleton w href, item-data opts', function (done) {
        var test = {
                "href": "http://item/1",
                "data": [
                    {"name": "name", value: "nicebadge", prompt: "name"},
                    {"name": "image", value: "nop", prompt: "image"},
                    {"name": "id", value: 1, prompt: "id"}
                ],
                "links": []
            },
            opts = {
                "href": "http://item/:id",
                "items":{
                    "name": "nicebadge",
                    "image": "nop",
                    "id": 1
                }
            };

        assert.deepEqual(test, mock.itemSkeleton(opts));
        done();
    });

    it('.itemSkeleton : generates array result of item options', function (done) {
        var test = [
                {
                    "href": "http://item/1",
                    "data": [
                        {"name": "name", value: "nicebadge", prompt: "name"},
                        {"name": "image", value: "nop", prompt: "image"},
                        {"name": "id", value: 1, prompt: "id"}
                    ],
                    "links": []
                },
                {
                    "href": "http://item/2",
                    "data": [
                        {"name": "name", value: "baddie", prompt: "name"},
                        {"name": "image", value: "yop", prompt: "image"},
                        {"name": "id", value: 2, prompt: "id"}
                    ],
                    "links": []
                }
            ],
            opts = {
                "href": "http://item/:id",
                "items":[
                    {
                        "name": "nicebadge",
                        "image": "nop",
                        "id": 1
                    },
                    {
                        "name": "baddie",
                        "image": "yop",
                        "id": 2
                    }]
            };

        assert.deepEqual(test, mock.itemSkeleton(opts));
        done();
    });

    it('.itemSkeleton : uses links', function (done) {
        var test = [
                {
                    "href": "http://user/1",
                    "data": [
                        {"name": "id", value: 1, prompt: "id"}
                    ],
                    "links": [
                        {"rel": "badges", "href": "http://user/1/badges", "prompt": "badges"}
                    ]
                },
                {
                    "href": "http://user/2",
                    "data": [
                        {"name": "id", value: 2, prompt: "id"}
                    ],
                    "links": [
                        {"rel": "badges", "href": "http://user/2/badges", "prompt": "badges"}
                    ]
                }
            ],
            opts = {
                "href": "http://user/:id",
                "items":[
                    {
                        "id": 1
                    },
                    {
                        "id": 2
                    }],
                "links": [
                    function () {
                        return {
                            rel: 'badges'
                        }
                    }
                ]
            },
            result = mock.itemSkeleton(opts);

        assert.deepEqual(test, result);
        done();
    });

    it('.itemSkeleton : generates skeleton from orm record', function (done) {
        conn().done(function (db) {
            var schemaUser = {
                    id: {
                        type: 'serial',
                        key: true,
                        klass: 'key',
                        mapsTo: 'id',
                        name: 'id' }
                },
                schemaOne = {
                    name: { type: 'text', size: 32 },
                    image: { type: 'text', size: 64 }
                },
                input = {
                    href: "http://user/:id",
                    items: []
                },
                expected = {
                    href: "http://user/1",
                    data: [
                        {name: "id", value: 1, prompt: "id"}
                    ],
                    links: [
                        {rel: "image", href: "http://user/1/image", prompt: "image"},
                        {rel: "badge", href: "http://user/1/badge", prompt: "badge"}
                    ]
                },
                modelOne,
                modelTwo,
                model;

            modelOne = db.define('image', schemaOne);
            modelTwo = db.define('badge', schemaOne);
            model = db.define('user', schemaUser);

            model.hasOne('image', modelOne);
            model.hasMany('badge', modelTwo, { date: {type: 'date'} });

            db.sync(function () {
                model.create({ id: 1}, function (err, record) {
                    if (err) {
                        return done(err);
                    }
                    input.items = record;
                    assert.deepEqual(expected, mock.itemSkeleton(input));
                    done(err);
                });
            });

        });
    });

    it('.skeleton : items are given, uses href', function (done) {
        var input = {
                "href": "http://href",
                "items": [
                    {
                        name: "foo"
                    },
                    {
                        name: "bar"
                    }
                ]
            },
            expected = {
                "collection": {
                    "version": "1.0",
                    "href": "http://href",
                    "links": [],
                    "items": [
                        {
                            "href" : "http://href/foo",
                            "data" : [
                                {"name" : "name", "value" : "foo", "prompt" : "name"}
                            ],
                            links: []
                        },
                        {
                            "href" : "http://href/bar",
                            "data" : [
                                {"name" : "name", "value" : "bar", "prompt" : "name"}
                            ],
                            links: []
                        }
                    ],
                    "queries": [],
                    "template": {
                        "data" : [
                            {"name" : "name", "value" : "", "prompt" : "name"}
                        ]
                    }
                }
            },
            result = mock.skeleton(input);
        assert.deepEqual(expected, result);
        done();
    });

    it('.skeleton : generates skeleton from record', function (done) {
        conn().done(function (db) {
            var schemaUser = {
                    id: {
                        type: 'serial',
                        key: true,
                        klass: 'key',
                        mapsTo: 'id',
                        name: 'id' }
                },
                schemaOne = {
                    name: { type: 'text', size: 32 },
                    image: { type: 'text', size: 64 }
                },
                input = {
                    href: "http://foo",
                    itemHref: "http://foo/user/:id",
                    items: []
                },
                expected = {
                    "collection": {
                        "version": "1.0",
                        "href": "http://foo",
                        "links": [],
                        "items": [
                            {
                                href: "http://foo/user/1",
                                data: [
                                    {name: "id", value: 1, prompt: "id"}
                                ],
                                links: [
                                    {rel: "image", href: "http://foo/user/1/image", prompt: "image"},
                                    {rel: "badge", href: "http://foo/user/1/badge", prompt: "badge"}
                                ]
                            },
                            {
                                href: "http://foo/user/2",
                                data: [
                                    {name: "id", value: 2, prompt: "id"}
                                ],
                                links: [
                                    {rel: "image", href: "http://foo/user/2/image", prompt: "image"},
                                    {rel: "badge", href: "http://foo/user/2/badge", prompt: "badge"}
                                ]
                            }
                        ],
                        "queries": [],
                        "template": {
                            data: [
                                {name: "id", value: "", prompt: "id"}
                            ]
                        }
                    }
                },
                modelOne = db.define('image', schemaOne),
                modelTwo = db.define('badge', schemaOne),
                model = db.define('user', schemaUser);

            model.hasOne('image', modelOne);
            model.hasMany('badge', modelTwo, { date: {type: 'date'} });

            model.sync(function () {
                model.create([{ id: 1}, {id: 2}], function (err, record) {
                    input.items = record;
                    var result = mock.skeleton(input);
                    assert.deepEqual(expected, result);
                    done();
                });
            });

        });
    });

});