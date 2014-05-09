'use strict';

var Rest = require('../lib/controller/restful'),
    opts;

opts = {
    param: {
        key: 'user_id'
    },
    model: {
        name: 'user',
        register: 'user'
    }
};

module.exports = Rest('/user', opts)
    .generate(['param:model', 'routes:item', 'routes:collection']);
