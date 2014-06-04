'use strict';

var util = require('util');

module.exports = ErrorHandler;

function ErrorHandler(config) {
    this.config = config;
}

Object.defineProperty(ErrorHandler.prototype, '_adapter', {
    enumerable: false,
    configurable: false,
    writable: true
});

Object.defineProperty(ErrorHandler.prototype, 'adapter', {
    enumerable: true,
    configurable: true,
    get: function () {
        if (!this._adapter) {
            this._adapter = this.adapterFactory(this.config);
        }
        return this._adapter;
    },
    set: function (obj) {
        this._adapter = obj;
    }
});

ErrorHandler.prototype.adapterFactory = function (config) {
    var adapter, args, handler, klass;

    adapter = config.adapter;
    args = config['arguments'] || [];

    if (!adapter) {
        throw new Error('Not found adapter in config');
    }
    // @todo refact, check adapters!
    switch(adapter) {
        default:
            klass = require('./errorhandler/adapter/' + adapter);
            handler = Object.create(klass.prototype);
            klass.apply(handler, args);
            break;
    }
    return handler;
};

ErrorHandler.prototype.handle = function (err, req, res, next) {
    if (!err) {
        next();
    }
    this.adapter.error(err);
    res.send(500);
};
