'use strict';

var generator = require('./strategy'),
    extend = require('node.extend'),
    events = require('events'),
    util = require('util');

module.exports = Controller;

function Controller(opts) {
    var defaultOptions = {
        param: {
            key: 'id',
            handler: null,
            model: 'model',
            register: 'register',
            assoc: {
                register: null,
                method: null
            }
        },
        generate: ['param:model', 'routes:item', 'routes:collection'],
        routes: {
            item: {
                verbs: ['GET', 'PUT', 'DELETE', 'PATCH'],
                uri: {
                    GET: null,
                    PUT: null,
                    POST: null,
                    DELETE: null,
                    PATCH: null

                },
                handler: {
                    GET: null,
                    PUT: null,
                    POST: null,
                    DELETE: null,
                    PATCH: null
                },
                middleware: {
                    GET: null,
                    PUT: null,
                    POST: null,
                    DELETE: null,
                    PATCH: null
                }
            },
            collection: {
                verbs: ['GET', 'POST'],
                uri: {
                    GET: null,
                    PUT: null,
                    POST: null,
                    DELETE: null,
                    PATCH: null

                },
                handler: {
                    GET: null,
                    PUT: null,
                    POST: null,
                    DELETE: null,
                    PATCH: null
                },
                middleware: {
                    GET: null,
                    PUT: null,
                    POST: null,
                    DELETE: null,
                    PATCH: null
                }
            }
        }
    };
    events.EventEmitter.call(this);
    this.conf = extend(true, {}, defaultOptions, opts);

    if (opts.generate) {
        this.conf.generate = opts.generate;
    }


    this.build();
}

util.inherits(Controller, events.EventEmitter);

Object.defineProperty(Controller.prototype, 'generated', {
    configurable: false,
    writable: true,
    enumerable: true,
    value: {}
});

Object.defineProperty(Controller.prototype, 'conf', {
    configurable: false,
    enumerable: true,
    writable: true
});

Object.defineProperty(Controller.prototype, 'app', {
    configurable: false,
    enumerable: true,
    writable: true,
    value: null
});

Controller.prototype.and = function (opts) {
    var chain = new Controller(opts);
    this.generated = extend(true, {}, this.generated, chain.generated);
    chain = null;
    return this;
};

Controller.prototype.next =
    Controller.prototype.with =
    Controller.prototype.chain =
    Controller.prototype.and ;

Controller.prototype.generate = function () {
    return function route(router) {
        this.emit('before:route', router, this.conf);
        var that = this;

        Object.keys(this.generated).forEach(function (key) {
            var gen = generator[key];
            if (!gen) {
                throw new Error('Not found generator: ' + gen);
            }
            that.emit('before:generate', key, gen);
            that.generated[key] = that.generated[key].filter(function (obj) {
                that.emit('generate', that, gen, obj);
                return gen.generate(that, router, obj);
            });

            that.emit('after:generate', key, gen);
            gen.store &&
                that.generated[key] &&
                gen.store(key, that.generated[key], router._mountpath);
        });

        this.emit('route', router, that);
    }.bind(this);
};

Controller.prototype.build = function () {
    var i, gen;
    if (this.conf.generate) {
        for(i = 0; i < this.conf.generate.length; i++) {
            gen = this.conf.generate[i];
            this.runGenerator(gen);
        }
    }
};

Controller.prototype.runGenerator = function (genType) {
    var that;

    if (!~genType.indexOf(':')) {
        that = this;
        Object.keys(generator).filter(function (el) {
            if (el.indexOf(genType) === 0) {
                return true;
            }
        }).forEach(function (el) {
            that.runGenerator(el);
        });
        return;
    }

    if (!generator[genType]) {
        throw new Error('Generator not found: ' +
            genType + '. Available: ' +
            Object.keys(generator).join(','));
    }
    this.emit('before:generator', genType, generator[genType]);
    generator[genType].build(this);
};

Controller.prototype.register = function(key, options) {
    this.generated[key] || (this.generated[key] = []);
    this.generated[key].push(options);
};