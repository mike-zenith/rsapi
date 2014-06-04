'use strict';

var Rest = require('../../lib/controller/restful'),
    opts;

opts = {
    param: {
        key: 'badge_id',
        model: 'badge',
        register: 'badge'
    }
};

module.exports = Rest('/', opts)
    .generate();
