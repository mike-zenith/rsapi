'use strict';

var Rest = require('../lib/controller/restful'),
    opts;

opts = {
    param: {
        key: 'user_id',
        model: 'user',
        register: 'user'
    }
};

module.exports = Rest('/user', opts)
    .generate(['param:model', 'routes:item', 'routes:collection']);
