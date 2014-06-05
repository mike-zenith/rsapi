'use strict';

var model = require('../../lib/service/models');

function manageRules(req, currency_id, Currency) {

    return model.parallel([
            ['find.all', req, 'rule', {currency_id: currency_id}],
            [User, 'getCurrencies', {currencies_id: currency_id}]
        ]).then(function (results) {
        var Rules = results[0],
            Currency = results[1][0],
            currentValue = Currency.value;

        results = Rules.filter(function (Rule) {
            console.log('rule!', Rule.currency_value, currentValue);
            return Rule.currency_value <= currentValue;
        });

        console.log('ok', results);

        return 200;
    });
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

            return model.parallel(User, 'addCurrencies', [Currency, {value: 1}]);

        }).then(function (result) {
            manageRules(req, data, result)
                .then(function (result) {
                    console.log('result', result);
                    res.send(200, result);
                },
                function (err) {
                    console.error('err', err.stack);
                    res.send(500, err);
                });
        },function (error) {
            console.error('error', error.stack);
            res.send(404, error);
        }).done();

    });

};