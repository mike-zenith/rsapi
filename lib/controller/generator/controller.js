'use strict';

var generator = require('./strategy'),
    nconf = require('nconf');

module.exports = Controller;

function Controller(key) {
    this.nconfKey = key;
}

Object.defineProperty(Controller.prototype, 'conf', {
    configurable: false,
    enumerable: true,
    get: function () {
        return nconf.get(this.nconfKey);
    }
});

Object.defineProperty(Controller.prototype, 'app', {
    configurable: false,
    enumerable: true,
    writable: true,
    value: null
});

Controller.prototype.generate = function (types) {
    if (types) {
        nconf.set(this.nconfKey + ':generate', types);
    }

    return function route(app) {
        this.init(app);
    }.bind(this);
};

Controller.prototype.init = function (app) {
    var i, gen;

    // registers the app
    this.app = app;

    for(i = 0; i < this.conf.generate.length; i++) {
        gen = this.conf.generate[i];
        this.applyGenerator(gen);
    }
};

Controller.prototype.applyGenerator = function (genType) {
    var that;

    if (!~genType.indexOf(':')) {
        that = this;
        Object.keys(generator).filter(function (el) {
            if (el.indexOf(genType) === 0) {
                return true;
            }
        }).forEach(function (el) {
            that.applyGenerator(el);
        });
        return;
    }

    if (!generator[genType]) {
        throw new Error('Generator not found: ' +
            genType + '. Available: ' +
            Object.keys(generator).join(','));
    }
    generator[genType].generate(this);
};

Controller.prototype.registerRoute = function (verb, uri, handler, mware) {
    var method = verb.toLowerCase();
    if (mware) {
        this.app.all(mware)[method](uri, handler.bind(this));
    } else {
        this.app[method](uri, handler.bind(this));
    }
};

Controller.prototype.registerParam = function(param, handler) {
    this.app.param(param, handler.bind(this));
};