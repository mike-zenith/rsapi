'use strict';

var Rest = require('../../lib/controller/restful'),
    opts;

opts = {
    param: {
        key: 'user_badges',
        register: 'user_badges',
        model: 'badge',
        assoc: {
            register: 'user',
            method: 'getBadges'
        }
    }
};

module.exports = Rest('/user/:user_id/badge', opts)
    .generate(['param:model', 'routes:item', 'routes:collection']);
