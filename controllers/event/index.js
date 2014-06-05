'use strict';

var model = require('../../lib/service/models');

function manageRules(req, currency_id, User) {

    return model.parallel([
        ['find.all', req, 'rule', {currency_id: currency_id}],
        [User, 'getCurrencies', {currencies_id: currency_id}]
    ]);
}


module.exports = function (router) {

    router.post('/', function (req, res) {
        var data = req.body;
        var value = data.value || 1;

        var dfd = model.parallel([
            ['find.one', req, 'user', data.user_id],
            ['find.one', req, 'currency', data.currency_id]
        ]);
        dfd.then(function (result) {
            var User = result[0],
                Currency = result[1];
            return model.parallel(Currency, 'addUsers', [User, {value: 1}]);
        }).then(function (result) {
            manageRules(req, data.currency_id, result[0])
                .then(function (result) {
                    console.log('result', result);
                    res.send(result);
                },
                function (err) {
                    console.error('err', err.stack);
                    res.send(500, err);
                });
        }, function (error) {
            console.error('error', error.stack);
            res.send(404, error);
        }).done()
        ;

    });

};