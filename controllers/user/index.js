'use strict';

var Rest = require('../../lib/controller/restful');

var user = {
    param: {
        key: 'user_id',
        model: 'user',
        register: 'user'
    }
};

var user_currency = {
    route: '/:user_id/currency',
    param: {
        key: 'user_currencies',
        register: 'user_currencies',
        model: 'currency',
        assoc: {
            register: 'user',
            method: 'currencies'
        }
    }
};

var user_badge = {
    route: '/:user_id/badge',
    param: {
        key: 'user_badges',
        register: 'user_badges',
        model: 'badge',
        assoc: {
            register: 'user',
            method: 'badges',
            param: 'rule_id'
        }
    }
};

module.exports = Rest('/', user)
    .with(user_currency)
    .with(user_badge)
    .generate();
