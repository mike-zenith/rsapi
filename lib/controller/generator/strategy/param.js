'use strict';

var strategy = require('./interface'),
    util = require('util');

function generator() {

}

util.inherits(generator, strategy);

Object.defineProperty(generator.prototype, 'register', {
    writable: false,
    enumerable: false,
    value: 'param:model'
});

generator.prototype.registrator = function (conf) {
    return function (req, res, next, id) {
        req.models[conf.model.name].get(id, function (err, record) {
            if (err && ~err.toString().indexOf('ORMError')) {
                if (err.code === 2) {
                    res.send(404);
                    next();
                    return;
                }
                res.json(500, err);
                next();
                return;
            }
            if (err) {
                res.json(500, err);
                next();
                return;
            }
            req[conf.model.register] = record;
            next();
        });
    };
};

generator.prototype.generate = function (app, service) {
    var conf = service.conf,
        paramCallback = conf.param.handler;

    if (!paramCallback) {
        paramCallback = this.registrator(conf);
    }

    service.registerParam(app, conf.param.key, paramCallback);
};

module.exports = generator;