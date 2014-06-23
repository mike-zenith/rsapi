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

    this.generated = {};

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

    Object.keys(chain.generated).forEach(function (key) {
        this.generated[key] || (this.generated[key] = []);
        if (util.isArray(chain.generated[key])) {
            chain.generated[key].forEach(function (el) {
                this.generated[key].push(el);
            }, this);
        } else {
            this.generated[key] = extend(true, {}, this.generated[key], chain.generated[key]);
        }
    }, this);

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
        Object.keys(this.generated).forEach(function (key) {
            var gen = generator[key];
            if (!gen) {
                throw new Error('Not found generator: ' + gen+ ' from key:' + key);
            }
            this.emit('before:generate', key, gen);
            this.generated[key] = this.generated[key].filter(function (obj) {
                this.emit('generate', this, gen, obj);
                return gen.generate(this, router, obj);
            }, this);

            this.emit('after:generate', key, gen);
            gen.store &&
                this.generated[key] &&
                gen.store(key, this.generated[key], router._mountpath);
        }, this);

        this.emit('route', router, this);
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
    this.register(generator[genType].build(this));
};

Controller.prototype.register = function(key_/*, options_*/) {
    var key = key_, options = arguments[1];
    if (!options && util.isArray(key)) {
        options = key_[1];
        key = key_[0];
    }

    this.generated[key] || (this.generated[key] = []);
    if (util.isArray(options)) {
        options.forEach(function (el) {
            this.generated[key].push(el);
        }, this);
    } else {
        this.generated[key].push(options);
    }

    // console.log(this.generated);
};