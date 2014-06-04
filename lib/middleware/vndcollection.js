'use strict';

var service = require('../service/vndcollection'),
    http = require('http'),
    util = require('util'),
    extend = require('node.extend');


var fakeKey = '+_send',
    handler = {
    isAccepted: function (body) {
        return typeof body === 'object' && !Buffer.isBuffer(body);
    },
    send: function (body_) {
        var args,
            index = 0,
            i,
            body,
            collectionResponse;

        // arguments leak prevents optimizing
        // workaround
        args = new Array(arguments.length);
        for(i = 0; i < args.length; i++) {
            args[i] = arguments[i];
        }

        if (2 === args.length) {
            if ('number' !== typeof body && 'number' === typeof arguments[1]) {
                this.statusCode = args[1];
                body = body_;
            } else {
                index = 1;
                this.statusCode = args[0];
                body = args[index];
            }
        } else {
            body = body_;
        }

        body || (body = []);

        if (handler.isAccepted(body)) {
            collectionResponse = function (q, s, next) {
                if (!body.hasOwnProperty('items')) {
                    body = {
                        items: !util.isArray(body) ? [body] : body
                    };
                }

                // @todo settings!
                if (!body.version) {
                    body.version = q.app.kraken.get('api:version');
                }
                if (!body.href) {
                    body.href = (q.app.kraken.get('api:uri') ||
                            q.protocol + '://' + q.get('host')) +
                        q.originalUrl;
                }
                args[index] = q.collection.skeleton(body);
                s.type('vnd.collection+json');
                s[fakeKey].apply(s, args);
            };

            this.format({
                'text': function (q, s, next) {
                    s.type('text/plain');
                    s[fakeKey].apply(s, args);
                },
                'html': function (q, s, next) {
                    s.type('text/html');
                    s[fakeKey].apply(s, args);
                },
                'json': function (q, s, next) {
                    s.type('application/json');
                    s.json.apply(s, args);
                },
                'application/vnd.collection+json': collectionResponse
            });
        } else {
            this[fakeKey].apply(this, args);
        }
    }
};

module.exports = function (config) {
    var vnd = new service();
    return function (req, res, next) {
        if (res[fakeKey]) {
            return next();
        }
        req.collection = vnd;
        res[fakeKey] = res.send;
        res.send = handler.send.bind(res);
        next();
    };
};