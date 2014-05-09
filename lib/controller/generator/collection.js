'use strict';

var itemGenerator = require('./item'),
    util = require('util'),
    methods;

methods = {
    'get': function (req, res) {
        req.models[this.conf.model.name].find(function (err, records) {
            if (err) {
                console.error(err);
                res.send(500, err);
                return;
            }
            console.log(JSON.stringify(records));
            res.json(records);
        });
    },
    'post': function (req, res) {
        if (!req.body) {
            return res.send(400);
        }

        req.models[this.conf.model.name].create(req.body, function (err, record) {
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
