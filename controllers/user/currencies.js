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

/*
module.exports = function (app) {
    app.get('/user/:user_id/currency', function (req, res) {
        req.user.getCurrencies(function (err, records) {
            if (err && ~err.toString().indexOf('ORMError')) {
                if (err.code === 2) {
                    return res.send(404);
                }
            }
            if (err) {
                return res.json(500, err);
            }
            return res.json(records);
        });
    });

    app.get('/user/:user_id/currency/:cid', function (req, res) {
        req.user.getCurrencies().limit(1).find({ id: req.param('cid')}, function (err, records) {
            if (err && ~err.toString().indexOf('ORMError')) {
                if (err.code === 2) {
                    return res.send(404);
                }
            }
            if (err) {
                return res.json(500, err);
            }
            res.send(records);
        });
    });

};
*/