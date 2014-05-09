'use strict';

var util = require('util'),
    extend = require('node.extend'),
    strategy = require('./strategy'),
    methods;

function generator() {

}

util.inherits(generator, strategy);

methods = {
    'get': function (req, res) {
        res.json(req[this.conf.model.register]);
    },
    'put': function (req, res) {
        if (!req.body) {
            res.send(400);
            return;
        }
        var record = req[this.conf.model.register];
        Object.keys(req.body).forEach(function (key) {
            record[key] = req.body[key];
        });

        record.save(function (err) {
            if (err) {
                console.error(err);
                res.json(500, err);
                return;
            }
            res.send(200, record);
        });
    },
    'delete': function (req, res) {
        req[this.conf.model.register].remove(function (err) {
            if (err) {
                console.error(err);
                res.json(500, err);
                return;
            }
            res.send(204);
        });
    },
    'patch': function (req, res) {
        if (!req.body) {
            res.send(400);
            return;
        }
        var record = req[this.conf.model.register];
        Object.keys(req.body).forEach(function (key) {
            record[key] = req.body[key];
        });

        record.save(function (err) {
            if (err) {
                console.error(err);
                res.json(500, err);
                return;
            }
            res.send(200, record);
        });
    }
};


Object.defineProperty(generator.prototype, 'methods', {
    writable: false,
    enumerable: true,
    value: methods
});

Object.defineProperty(generator.prototype, 'register', {
    writable: false,
    enumerable: false,
    value: 'routes:item'
});

generator.prototype.getConfig = function (conf) {
    return conf.routes.item;
};

generator.prototype.generateUri = function (conf, verb) {
    return conf.route + '/:' + conf.param.key;
};

generator.prototype.generate = function (app, service) {
    var i, verb, verbKey,
        conf = service.conf,
        routeConfig = this.getConfig(conf);

    for(i = 0; i < routeConfig.verbs.length; i++) {
        verb = routeConfig.verbs[i];
        verbKey = verb.toLocaleLowerCase();
        if (!routeConfig.handler[verb]) {
            routeConfig.handler[verb] = this.methods[verbKey];
        }
        if (!routeConfig.uri[verb]) {
            routeConfig.uri[verb] = this.generateUri(conf, verb);
        }
        service.registerRoute(
            app,
            verb,
            routeConfig.uri[verb],
            routeConfig.handler[verb],
            routeConfig.middleware[verb]);
    }
};

module.exports = generator;