/*global describe:false, it:false, before:false, after:false, afterEach:false*/

'use strict';


var assert = require('assert'),
    extend = require('node.extend'),

    service = require('../../lib/service/vndcollection/orm'),
    orm = require('orm'),
    q = require('q');

describe('#lib/service/vndcollection/orm', function () {

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
        mock = service;
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

    it('.properts: Reads model properties', function (done) {
        conn().done(function (db) {
            var schema = {
                    name: { type: 'text', size: 64 },
                    image: { type: 'text', size: 128 },
                    id: {
                        type: 'serial',
                        key: true,
                        klass: 'key',
                        mapsTo: 'id',
                        name: 'id' }
                },
                model = db.define('badge', schema);

            assert.deepEqual(schema, mock.properties(model));
            done();
        });
    });

    it('.schema: does not read assoc-related fields', function (done) {
        conn().done(function (db) {
            var schema = {
                    name: { type: 'text', size: 64 },
                    image: { type: 'text', size: 128 },
                    id: { type:'integer', primary: true }
                },
                model = db.define('badge', extend(true, {}, schema)),
                model2 = db.define('badge2', extend(true, {}, schema));

            model.hasOne('badge2', model2);

            assert.deepEqual(Object.keys(schema), Object.keys(mock.schema(model)));
            done();
        });
    });

    it('.schema: can read assoc related fields too', function (done) {
        conn().done(function (db) {
            var schema = {
                    name: { type: 'text', size: 64 },
                    image: { type: 'text', size: 128 },
                    id: { type:'integer', primary: true }
                },
                expected = extend(true, {}, schema, {'badge2_id': {}}),
                model = db.define('badge', extend(true, {}, schema)),
                model2 = db.define('badge2', extend(true, {}, schema));
            model.hasOne('badge2', model2);

            assert.deepEqual(Object.keys(expected), Object.keys(mock.schema(model, true)));
            done();
        });
    });


    it('.toTemplate : converts model schema to vnd item template', function (done) {
        conn().done(function (db) {
            var schema = {
                    name: { type: 'text', size: 64 },
                    image: { type: 'text', size: 128 },
                    id: {
                        type: 'serial',
                        key: true,
                        klass: 'key',
                        mapsTo: 'id',
                        name: 'id' }
                },
                expected = [
                    {name: "name", value: "", prompt: "name"},
                    {name: "image", value: "", prompt: "image"},
                    {name: "id", value: "", prompt: "id"}
                ],
                model = db.define('badge', schema);

            assert.deepEqual(expected, mock.toTemplate(model));
            done();
        });
    });

    it('.associations : reads record associations', function (done) {
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
                expected = {
                    image: {
                        type: 'one',
                        name: 'image',
                        model: null,
                        field: {
                            image_id: {
                                type: 'integer',
                                unsigned: true,
                                size: 4,
                                required: false,
                                name: 'image_id',
                                mapsTo: 'image_id'
                            }
                        }
                    }
                },
                modelOne = db.define('image', schemaOne),
                model = db.define('user', schemaUser);

            model.hasOne('image', modelOne);

            model.sync(function () {
                model.create({ id: 1}, function (err, record) {
                    assert.deepEqual(
                        Object.keys(expected.image),
                        Object.keys(mock.associations(record).image));
                    done();
                });
            });
        });
    });



});