'use strict';

var service = require('../service/vndcollection'),
    nconf = require('nconf'),
    http = require('http'),
    util = require('util');


var handler = {
    isAccepted: function (body) {
        return typeof body === 'object' && !Buffer.isBuffer(body);
    },
    generate: function (body) {
        var args = arguments,
            i = 0;
        body = args[i];

        if (2 === arguments.length) {
            if ('number' !== typeof body && 'number' === typeof arguments[1]) {
                this.statusCode = arguments[1];
            } else {
                this.statusCode = body;
                body = arguments[1];
                i = 1;
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
                    // @todo type vnd.collection+json does not populate res.body
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