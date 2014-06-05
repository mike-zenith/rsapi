'use strict';

var timer = require('timers'),
    util = require('util'),
    Q = require('q'),
    modelService = require('../../lib/service/models'),
    extend = require('node.extend');

function middleware (data) {
    var keys = Object.keys(data);

    return function(req, res, next) {
        var db, dfd = Q();
        if (req.db && req.db.length) {
            db = req.db[Object.keys(req.db)[0]].driver;
        } else if(req.db && req.db.clear) {
            db = req.db;
        } else if (req.db && req.db.driver) {
            db = req.db.driver;
        }

        keys.forEach(function (key) {
            if (~key.indexOf('_')) {
                dfd = dfd.then(function () {
                    return Q.ninvoke(db, 'clear', key);
                });
                data[key].forEach(function (record) {
                    dfd = dfd.then(function () {
                        return Q.ninvoke(db, 'insert', key, record, null);
                    });
                });

                return;
            }

            var model = req.models[key];
            dfd = dfd
                .then(function () {
                    return Q.ninvoke(db, 'clear', key);
                })
                .then(modelService.promise(model, 'sync'));

            data[key].forEach(function (record) {
                dfd = dfd.then(modelService.promise(model, 'create', [record]));
            });
        });
        dfd.then(
            function () { next(null); },
            function (e) { next(e); })
            .done();

    }
}

var Provider = {
    middleware: middleware,
    onconfig: function (app, spec, data_) {
        var data = extend(true, {}, data_);
        return function (config, next) {
            spec(app).onconfig(config, function (err, config) {
                if (err) {
                    return next(err, config);
                }
                config.set('middleware:dummydataprovider', {
                    "enabled": true,
                    "priority": 200,
                    "module": {
                        "name": process.cwd() + "/test/data/provider",
                        "method": "middleware",
                        "arguments": [ data ]
                    }
                });
                next(null, config);
            });
        }
    }
};


module.exports = Provider;