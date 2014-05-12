'use strict';

var Rest = require('../lib/controller/restful'),
    opts;

opts = {
    param: {
        key: 'currency_id',
        model: 'currency',
        register: 'currency'
    }
};


module.exports = Rest('/currency', opts)
    .generate(['param:model', 'routes:item', 'routes:collection']);
