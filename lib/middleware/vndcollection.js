'use strict';

var service = require('../service/vndcollection'),
    nconf = require('nconf'),
    http = require('http'),
    util = require('util');


var handler = {
    isAccepted: function (body) {
        return typeof body === 'object' && !Buffer.isBuffer(body);
    },
    generate: function (body_) {
        var args,
            i = 0,
            body;

        // arguments leak prevents optimizing
        // workaround
        args = new Array(arguments.length);
        for(i = 0; i < args.length; i++) {
            args[i] = arguments[i];
        }
        body = args[i];

        if (2 === args.length) {
            if ('number' !== typeof body && 'number' === typeof arguments[1]) {
                this.statusCode = args[1];
            } else {
                i = 1;
                this.statusCode = body;
                body = args[i];
            }
        }

        if (handler.isAccepted(body)) {
            this.format({
                'text': function (q, s, next) {
                    s.type('text/plain');
                    s._send.apply(s, args);
                },
                'html': function (q, s, next) {
                    s.type('text/html');
                    s._send.apply(s, args);
                },
                'json': function (q, s, next) {
                    s.type('application/json');
                    s._send.apply(s, args);
                },
                'application/vnd.collection+json': function (q, s, next) {
                    args[i] = q.collection.skeleton(body);
                    s.type('vnd.collection+json');
                    s._send.apply(s, args);
                }
            });
        } else {
            this._send.apply(this, args);
        }
    }
};

module.exports = function () {
    var vnd = new service();

    return function (req, res, next) {
        req.collection = vnd;
        res._send = res.send;
        res.send = handler.generate.bind(res);
        next();
    };
};