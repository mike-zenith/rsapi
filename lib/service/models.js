'use strict';

var fs = require('fs'),
    util = require('util'),
    Q = require('q');

var QModel = function(req, modelName, args_, method_, nopromise) {
    var fn = function () {
        var method = method_ || 'find',
            args = args_ !== undefined ?
                util.isArray(args_) ?
                    args_ :
                    [args_]
                : [],
            model = req.models && req.models[modelName] ?
                req.models[modelName]
                : req;
        return Q.npost(model, method, args);
    };

    return nopromise ? fn() : fn;
};

var findMethods = {
    by: function (req, modelName, syntaxCallback) {
        return QModel(req, modelName, [syntaxCallback], 'one', this.nopromise);
    },
    all: function (req, modelName, props) {
        return QModel(req, modelName, [props], 'find', this.nopromise);
    },
    one: function (req, modelName, id) {
        return QModel(req, modelName, [id], 'get', this.nopromise);
    }
};

Object.defineProperty(findMethods, 'nopromise', {
    configurable: false,
    writable: true,
    enumerable: false,
    value: false
});

var parallel = Object.create(findMethods);
parallel.nopromise = true;

Object.defineProperty(findMethods, 'parallel', {
    configurable: false,
    writable: false,
    enumerable: false,
    value: parallel
});

module.exports = {
    load: function (config, db, cb) {
        var path;
        fs.readdirSync(config.modelsPath).forEach(function(file) {
            path = config.modelsPath + '/' + file;
            require(path)(db);
        });
        cb(null, db);
    },

    'promise': function (model, method, args) {
        return QModel(model, null, args, method);
    },
    parallel: {
        find: parallel
    },
    find: findMethods
};