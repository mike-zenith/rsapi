'use strict';

var Rest = require('../../../../lib/controller/restful'),
    opts;

opts = {
    'generate': null
};

module.exports = Rest('/', opts)
    .on('route', function (router) {
        router.get('/', function (req, res) {
            res.send(200);
        });
    })
    .generate();
