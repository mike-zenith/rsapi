'use strict';

var timer = require('timers'),
    util = require('util'),
    extend = require('node.extend');

function middleware (data) {
    var keys = Object.keys(data),
        len = 0,
        err = null,
        cntr = 0,
        progress = false,
        loaded = false;

    keys.forEach(function (l) {
        if (util.isArray(data[l])) {
            len += data[l].length;
        }
    });
    return function(req, res, next) {
        if (loaded) {
            return next();
        }

        var cb, db;

        if (progress) {
            return;
        }
        progress = true;

        if (req.db && req.db.length) {
            db = req.db[Object.keys(req.db)[0]].driver;
        } else if(req.db && req.db.clear) {
            db = req.db;
        } else if (req.db && req.db.driver) {
            db = req.db.driver;
        }

        cb = function (e) {
            cntr ++;
            if (e) {
                console.error("data-provider error", e);
                next(e);
            }
            err = err || e;
            if (cntr === len) {
                loaded = true;
                next(err);
            }
        };

        keys.forEach(function (key) {
            if (~key.indexOf('_')) {
                db.clear(key, (function (key, rows) {
                    return function (err) {
                        if (err) {
                            cb(err);
                            return;
                        }
                        rows.forEach(function (record) {
                            db.insert(key, record, null, cb);
                        });
                    }
                })(key, extend(true, data[key])));
                return;
            }

            var model = req.models[key],
                rows = extend(true, data[key]);
            if (!model) {
                cb();
                return;
            }

            model.clear(function () {
                rows.forEach(function (record) {
                    model.create(record, cb);
                });
            });
        });
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
                console.log(config.get('path'));
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