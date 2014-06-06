'use strict';

var Controller = require('./generator/controller'),
    Q = require('q');

module.exports = restful;

//@todo better refact this facade, itsnot required in newer versions of kraken&enrouten

function restful(route, options) {
    var opts;

    if (!route) {
        throw new Error('Invalid arguments: route missing');
    }

    opts = options;
    opts.route || (opts.route = route);

    return new Controller(opts);
}