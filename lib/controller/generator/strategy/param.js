'use strict';

var strategy = require('./interface'),
    extend = require('node.extend'),
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
        var method, model, params, assocMethod;

        if (!conf.model) {
            return next();
        }

        params = id;
        model = req.models[conf.model];
        method = 'get';

        if (conf.assoc && conf.assoc.register) {
            assocMethod = 'get' + conf.assoc.method[0].toUpperCase() + conf.assoc.method.substr(1);
            model = req[conf.assoc.register][assocMethod]();
            method = 'find';
            params = {};
            params[conf.assoc.param || conf.assoc.method + '_id'] = id;

            console.log('itt', conf.assoc.register, conf.assoc.method, method, params);
        }

        if (!model) {
            console.error('No model', conf, model);
            return next();
        }

        model[method](params, function (err, record) {
            if (err && ~err.toString().indexOf('ORMError')) {
                if (err.code === 2) {
                    console.log('Not found model', req.originalUrl, conf.model, conf.assoc, params);
                    res.send(404);
                    next();
                    return;
                }
                res.json(500, err);
                next();
                return;
            } else if (err) {
                console.error('Error', err);
                res.json(500, err);
                next();
                return;
            }
            req[conf.register || conf.model] = record;
            next();
        });
    };
};

generator.prototype.build = function (service) {
    var conf = service.conf.param,
        paramCallback;

    paramCallback = conf.handler || this.registrator(extend(true, {}, conf));
    return [this.register, { name: conf.key, handler: paramCallback }];
};

generator.prototype.generate = function (service, router, options) {
    service.emit('generate:' + this.register, router, options);
    return options.handler &&
        router.param(options.name, options.handler.bind(service));
};

module.exports = generator;