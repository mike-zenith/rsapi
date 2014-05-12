'use strict';

var extend = require('node.extend'),
    nconf = require('nconf'),
    Controller = require('./generator/controller'),
    defaultOptions;

defaultOptions = {
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

module.exports = restful;

function restful(route, options) {
    var opts;

    if (!route) {
        throw new Error('Invalid arguments: route missing');
    }

    opts = {
        key: 'ctrl-' + route,
        type: 'literal',
        store: {}
    };

    opts.key = opts.key.replace(/:/gi,'_');

    opts.store[opts.key] = extend(
        true,
        {},
        defaultOptions,
        options || {},
        { route: route });

    nconf.add(opts.key, opts);

    return new Controller(opts.key);
}