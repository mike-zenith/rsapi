'use strict';

var util = require('util'),
    extend = require('node.extend'),
    strategy = require('./interface'),
    express = require('express'),
    methods;

function generator() {

}

util.inherits(generator, strategy);

methods = {
    'get': function (conf) {
        return function (req, res) {
            res.json(req[conf.param.register]);
        };
    },
    'put': function (conf) {
        return function (req, res) {
            if (!req.body) {
                res.send(400);
                return;
            }

            var record = req[conf.param.register];
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
        };
    },
    'delete': function (conf) {
        return function (req, res) {
            req[conf.param.register].remove(function (err) {
                if (err) {
                    console.error(err);
                    res.json(500, err);
                    return;
                }
                res.send(204);
            });
        };
    },
    'patch': function (conf) {
        return function (req, res) {
            if (!req.body) {
                res.send(400);
                return;
            }
            var record = req[conf.param.register];
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
        };
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
    return conf.route +
        (conf.route.substr(-1) === '/' ?
            ':' :
            '/:' ) +
        conf.param.key;
};

generator.prototype.build = function (service) {
    var i, verb, verbKey,
        conf = service.conf,
        config = {},
        routeConfig = this.getConfig(conf),
        result = [this.register, []];

    for(i = 0; i < routeConfig.verbs.length; i++) {
        verb = routeConfig.verbs[i];
        verbKey = verb.toLocaleLowerCase();
        if (!routeConfig.handler[verb]) {
            routeConfig.handler[verb] = this.methods[verbKey](conf);
        }
        if (!routeConfig.uri[verb]) {
            routeConfig.uri[verb] = this.generateUri(conf, verb);
        }

        config = {
            'uri': routeConfig.uri[verb],
            'verb': verb.toLowerCase(),
            'handler': routeConfig.handler[verb],
            'middleware': routeConfig.middleware[verb]
        };
        result[1].push(config);
    }
    return result;
};

generator.prototype.generate = function (service, router, options) {
    var registrator;
    if (options.middleware) {
        registrator = router.all.apply(router, options.middleware);
    } else {
        registrator = router;
    }
    // console.log('+' , options.verb, options.uri);
    service.emit('generate:' + this.register, router, options);
    return options.handler &&
        registrator[options.verb](options.uri, options.handler.bind(service));
};

module.exports = generator;