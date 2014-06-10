'use strict';

var model = require('../service/models'),
    util = require('util');

var service = {
    addCurrency: function (User, Currency, value) {
        return model.immediate(User, 'getCurrencies', {currencies_id: Currency.id})
            .then(function(Currencies) {
                var Curr = Currencies[0],
                    currentValue;

                if (!Curr) {
                    return model.immediate(User, 'addCurrencies', [Currency, {value: value}])
                        .then(function () {
                            return {
                                user: User,
                                currency_id: Currency.id,
                                previousValue: 0,
                                currentValue: value
                            };
                        });
                }

                currentValue = Curr.extra.value;
                // console.log('current value', currentValue);
                Curr.extra.value = currentValue + parseInt(value);
                // console.log('new value', Currency.value);
                model.immediate(Curr, 'save').fail(function (e) {
                    throw new Error('Saving currency failed' + Curr.toString());
                });
                return {
                    user: User,
                    currency_id: Curr.id,
                    previousValue:currentValue,
                    currentValue: Curr.extra.value
                };
            });
    },
    addBadges: function (req) {
        return function (result) {
            var tools = util.isArray(req.db) ?
                    req.db.shift().tools :
                    req.db.tools,
                findProps = {
                    currency_id: result.currency_id,
                    disabled: false,
                    currency_value: tools.gt(result.previousValue),
                    and: [{currency_value: tools.lte(result.currentValue)}]
                };

            // currency_id = x AND currency_value > y AND currency_value <= value
            return model.find.immediate
                .all(req, 'rule', findProps)
                .then(function (Rules) {
                    var now = new Date();

                    Rules = Rules.filter(function (Rule) {
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
                    });
                    if (!Rules || !Rules.length) {
                        return model.immediate([]);
                    }

                    return model.immediate(
                        result.user,
                        'addBadges',
                        [Rules, { date: new Date() }]);
                });
        };
    }
};


module.exports = service;