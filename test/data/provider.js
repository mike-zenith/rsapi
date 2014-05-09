'use strict';

var timer = require('timers'),
    util = require('util'),
    extend = require('node.extend');

function middleware (data, progress, loaded) {
    var keys = Object.keys(data),
        len = 0,
        err = null,
        cntr = 0;

    keys.forEach(function (l) {
        if (util.isArray(data[l])) {
            len += data[l].length;
        }
    });
    return function(req, res, next) {
        if (loaded) {
            return next();
        }

        var to, cb;

        if (progress) {
            to = timer.setTimeout(function () {
                if (loaded) {
                    timer.clearTimeout(to);
                    next();
                }
            },10);
            return;
        }
        progress = true;

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
            var db;
            if (~key.indexOf('_')) {
                if (req.db.length) {
                    db = req.db[Object.keys(req.db)[0]].driver;
                } else if(req.db && req.db.clear) {
                    db = req.db;
                } else if (req.db && req.db.driver) {
                    db = req.db.driver;
                } else {
                    cb();
                    return;
                }
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


module.exports = {
    load: function (app, rawData) {
        var loaded = false,
            progress = false;

        app.before.push(middleware(extend(true, {}, rawData), progress, loaded));
    }
};