'use strict';

var generator = require('./generator'),
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
    for(i = 0; i < this.conf.generate.length; i++) {
        gen = this.conf.generate[i];
        this.applyGenerator(gen, app);
    }
};

Controller.prototype.applyGenerator = function (genType, app) {
    var that;

    if (!~genType.indexOf(':')) {
        that = this;
        Object.keys(generator).filter(function (el) {
            if (el.indexOf(genType) === 0) {
                return true;
            }
        }).forEach(function (el) {
            that.applyGenerator(el, app);
        });
        return;
    }

    if (!generator[genType]) {
        throw new Error('Generator not found: ' +
            genType + '. Available: ' +
            Object.keys(generator).join(','));
    }
    generator[genType].generate(app, this);
};

Controller.prototype.registerRoute = function (app, verb, uri, handler, mware) {
    var method = verb.toLowerCase();
    if (mware) {
        app.all(mware)[method](uri, handler.bind(this));
    } else {
        console.log('app.', method, uri);
        app[method](uri, handler.bind(this));
    }
};

Controller.prototype.registerParam = function(app, param, handler) {
    console.log('app.param', param);
    app.param(param, handler.bind(this));
};