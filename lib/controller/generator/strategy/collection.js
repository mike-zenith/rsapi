'use strict';

var itemGenerator = require('./item'),
    util = require('util'),
    methods;

methods = {
    'get': function (req, res) {
        var model, method, params, conf;
        conf = this.conf.param;
        model = req[conf.register];
        method = 'find';
        params = {};

        if (conf.assoc && conf.assoc.register) {
            model = req[conf.assoc.register][conf.assoc.method];
        }

        model[method](params,function (err, records) {
            if (err) {
                console.error(err);
                res.send(500, err);
                return;
            }
            res.json(records);
        });
    },
    'post': function (req, res) {
        if (!req.body) {
            return res.send(400);
        }
        var model, method;

        model = req[this.conf.param.register];
        method = 'create';

        model[method](req.body, function (err, record) {
            if (err) {
                console.error(err);
                res.send(500, err);
                return;
            }
            res.send(record);
        });
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
