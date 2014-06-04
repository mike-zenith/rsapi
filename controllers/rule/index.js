'use strict';

var Rest = require('../../lib/controller/restful'),
    opts;

opts = {
    param: {
        key: 'rule_id',
        model: 'rule',
        register: 'rule'
    }
};


module.exports = Rest('/', opts)
    .generate();
