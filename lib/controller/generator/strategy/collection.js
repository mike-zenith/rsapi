'use strict';

var itemGenerator = require('./item'),
    util = require('util'),
    methods;

methods = {
    'get': function (conf) {
        return function (req, res) {
            var model, method, params, cfg, assocMethod;
            cfg = conf.param;
            model = req.models[cfg.model];
            method = 'find';
            params = {};
            if (cfg.assoc && cfg.assoc.register) {
                assocMethod = 'get' + cfg.assoc.method[0].toUpperCase() + cfg.assoc.method.substr(1);
                model = req[cfg.assoc.register][assocMethod]();
            }

            if (!model) {
                console.log('Not found collection record', req.originalUrl, cfg);
                return res.send(404);
            }

            model[method](params, function (err, records) {
                if (err) {
                    console.error(err);
                    res.send(500, err);
                    return;
                }
                res.json(records);
            });
        };
    },
    'post': function (conf) {
        return function (req, res) {
            if (!req.body) {
                return res.send(400);
            }
            var model, method;

            model = req.models[conf.param.model];
            method = 'create';

            if (!model) {
                return res.send(404);
            }
            model[method](req.body, function (err, record) {
                if (err) {
                    console.error(err);
                    res.send(500, err);
                    return;
                }
                res.send(record);
            });
        };
    }
};

function generator() {

}

util.inherits(generator, itemGenerator);

Object.defineProperty(generator.prototype, 'methods', {
    writable: false,
    enumerable: true,
    value: methods
});

Object.defineProperty(generator.prototype, 'register', {
    writable: false,
    enumerable: false,
    value: 'routes:collection'
});

generator.prototype.getConfig = function (conf) {
    return conf.routes.collection;
};

generator.prototype.generateUri = function (conf, verb) {
    return conf.route;
};

module.exports = generator;
