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

generator.prototype.registrator = function (req, res, next, id) {
    var conf = this.conf.param,
        method, model, params;

    if (!conf.model) {
        return next();
    }

    params = id;
    model = req.models[conf.model];
    method = 'get';

    if (conf.assoc && conf.assoc.register) {
        model = req[conf.assoc.register][conf.assoc.method]();
        method = 'find';
        params = {id: id};
    }

    model[method](params, function (err, record) {
        if (err && ~err.toString().indexOf('ORMError')) {
            if (err.code === 2) {
                console.log('Not found model', conf.model, conf.assoc, params);
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
        req[conf.register || conf.model] = record;
        next();
    });
};

generator.prototype.generate = function (service) {
    var conf = service.conf.param,
        paramCallback;

    paramCallback = conf.handler || this.registrator;

    service.registerParam(conf.key, paramCallback);
};

module.exports = generator;