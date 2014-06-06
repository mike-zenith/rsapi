'use strict';

var model = require('../service/models'),
    util = require('util');

var service = {
    addCurrency: function (User, Currency, value) {
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
    },
    addBadges: function (req) {
        return function (result) {
            var tools = util.isArray(req.db) ?
                    req.db.shift().tools :
                    req.db.tools,
                findProps = {
                    currency_id: result.currency.id,
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
                    /*

                    .map(function (Rule) {
                        // @TODO parse parent and check options
                        // these rules define a badge and a credit value that
                        // should be credited to the user
                        return model.immediate(Rule, 'getBadge')
                            .then(function (Badge) {
                                return model.immediate(
                                        result.user,
                                        'addBadges',
                                        [Rule, { badge_id: Badge.id }])
                                    .then(function () {
                                        return Rule;
                                    });
                            });
                    }));*/
                });
        };
    }
};


module.exports = service;