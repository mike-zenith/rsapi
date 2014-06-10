'use strict';

var Q = require('q'),
    util = require('util');


Q.longStackSupport = true;
Q.longStackJumpLimit = 0;

function validateParams(model, method, args) {
    args = args !== undefined ?
        util.isArray(args) ?
            args :
            [args]
        : [];

    if (!model || !method) {
        throw new Error('No model or method');
    }
    if (typeof model[method] !== 'function') {
        throw new Error('Method is not callable on model:' + method);
    }

    return args;
}


function QModel(req_, modelName_, method_, args_, nopromise_) {
    var model, args, method, nopromise;

    if (arguments.length === 5) {
        model = req_.models[modelName_];
        method = method_;
        args = args_;
        nopromise = nopromise_;
    } else {
        model = req_;
        method = modelName_;
        args = method_;
        nopromise = args_;
    }

    args = validateParams(model, method, args);
    return nopromise ?
        Q.npost(model, method, args) :
        function() {
            return Q.npost(model, method, args);
        };
}

var findMethods = {
    by: function (req, modelName, syntaxCallback) {
        if (syntaxCallback === void 0) {
            return QModel(req, 'one', modelName, this.nopromise);
        }
        return QModel(req, modelName, 'one', syntaxCallback, this.nopromise);
    },
    all: function (req, modelName, props) {
        if (props === void 0) {
            return QModel(req, 'find', modelName, this.nopromise);
        }
        return QModel(req, modelName, 'find', props, this.nopromise);
    },
    one: function (req, modelName, id) {
        if (id === void 0) {
            return QModel(req, 'get', modelName, this.nopromise);
        }
        return QModel(req, modelName, 'get', id, this.nopromise);
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

findMethods.parallel = findMethods.immediate = parallel;

function parseParallel(model) {
    var parallel = [];
    if ({}.toString.call(model[0]) === '[object Function]') {
        parallel = model;
    } else {
        var i = 0, len = model.length, data, serviceMethod;
        for(; i<len; i++) {
            data = model[i];
            if (typeof data[0] === 'string' && ~data[0].indexOf('find')) {
                serviceMethod = data.shift();
                parallel.push(
                    service.find.parallel[
                        serviceMethod.substr(5)
                    ].apply(service.find.parallel, data)
                );
            } else if ({}.toString.call(data) === '[object Object]' && data.then) {
                parallel.push(data);
            } else {
                parallel.push(service.parallel.apply(service.parallel, data));
            }
        }
    }
    return parallel;
}

var service = {
    promise: function (model, method, args) {
        return QModel(model, method, args);
    },
    parallel: function (model, method, args) {
        if (util.isArray(model) && !method && !args) {
            return Q.all(parseParallel(model));
        }
        return QModel(model, method, args, 1);
    },
    find: findMethods
};

service.immediate = service.parallel;

module.exports = service;
