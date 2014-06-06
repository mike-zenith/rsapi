'use strict';

var model = require('../../lib/service/models'),
    Q = require('q');

function addCurrency(User, Currency, value) {
    return model.immediate(User, 'getCurrencies', {currencies_id: Currency.id})
        .then(function(Currencies) {
            var Currency = Currencies[0],
                currentValue = Currency.extra.value;
            // console.log('current value', currentValue);
            Currency.extra.value = currentValue + parseInt(value);
            // console.log('new value', Currency.value);
            model.immediate(Currency, 'save').fail(function (e) {
                console.error('currency save error', e.stack);
            });
            return {
                user: User,
                currency: Currency,
                previousValue:currentValue,
                currentValue: Currency.extra.value
            };
        });
}

function addBadges(req) {
    return function (result) {
        var findProps = {
                currency_id: result.currency.id,
                disabled: false,
                currency_value: req.db.tools.gt(result.previousValue),
                and: [{currency_value: req.db.tools.lte(result.currentValue)}]
            };

        // currency_id = x AND currency_value > y AND currency_value <= value
        return model.find.immediate
            .all(req, 'rule', findProps)
            .then(function (Rules) {
                var now = new Date();

                return model.immediate(Rules.filter(function (Rule) {
                    // @TODO not eligible rules should be logged
                    if (!Rule) {
                        return false;
                    }

                    if (Rule.activeFrom && Rule.activeUntil) {
                        var from = Date.parse(Rule.activeFrom),
                            until = Date.parse(Rule.activeUntil);
                        return from >= now && until <= now;
                    }
                    return true;
                }).map(function (Rule) {
                    // @TODO parse parent and check options
                    // these rules define a badge and a credit value that
                    // should be credited to the user
                    return model.immediate(Rule, 'getBadge')
                        .then(function (Badge) {
                            return model.immediate(
                                result.user,
                                'addBadges',
                                [Badge, { rule_id: Rule.id }])
                                .then(function () {
                                    return Rule;
                                });
                        });
                }));
            });
    };
}


module.exports = function (router) {

    router.post('/', function (req, res) {
        var data = req.body;
        var value = data.value || 1;

        model.immediate([
                ['find.one', req, 'user', data.user_id],
                ['find.one', req, 'currency', data.currency_id]
            ]).then(function (result) {
                var User = result[0],
                    Currency = result[1];

                return addCurrency(User, Currency, value)
                    .then(addBadges(req));
            }).then(function (result) {
                return res.send({ earned: result.length, rules: result });
            },function (err) {
                console.error('err', err.stack);
                return res.send(500, err);
            })
            .done();
    });

};