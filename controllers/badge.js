'use strict';

var Rest = require('../lib/controller/restful'),
    opts;

opts = {
    param: {
        key: 'badge_id'
    },
    model: {
        name: 'badge',
        register: 'badge'
    }
};

module.exports = Rest('/badge', opts)
    .generate(['param:model', 'routes:item', 'routes:collection']);
