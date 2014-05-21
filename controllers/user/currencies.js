'use strict';

var Rest = require('../../lib/controller/restful'),
    opts;

opts = {
    param: {
        key: 'user_currencies',
        register: 'user_currencies',
        model: 'currency',
        assoc: {
            register: 'user',
            method: 'getCurrencies'
        }
    }
};

module.exports = Rest('/user/:user_id/currency', opts)
    .generate(['param:model', 'routes:item', 'routes:collection']);