'use strict';

var Q = require('q'),
    model = require('../../lib/service/models');

module.exports = function (router) {

    router.post('/', function (req, res) {
        var data = req.body;
        var value = data.value || 1;

        var dfd = Q.all([
            model.parallel.find.one(req, 'user', data.user_id),
            model.parallel.find.one(req, 'currency', data.currency_id)
        ]);

        dfd.then(function (result) {
            var User = result[0],
                Currency = result[1];

            return Q.ninvoke(User, 'addCurrencies', Currency, {value: 1});
        }).then(function (result) {
            res.send(result);
        }, function (error) {
            console.error('error', error.stack);
            res.send(404, error);
        });
    });

};