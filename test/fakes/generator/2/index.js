'use strict';

var Rest = require('../../../../lib/controller/restful'),
    util = require('util'),
    opts;

opts = {
    'generate': ["routes:collection"]
};

module.exports = Rest('/', opts)
    .on('generate:routes:collection', function (router, options) {
        if (options.uri === '/') {
            options.handler = null;
        }
    })
    .on('generate:routes:collection', function (router, options) {
        if (options.uri === '/') {
            options.handler = function (req, res) {
                res.send(200);
            };
        }
    })
    .generate();
