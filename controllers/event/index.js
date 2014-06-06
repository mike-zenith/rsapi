'use strict';

var model = require('../../lib/service/models'),
    Q = require('q'),
    event = require('../../lib/controller/event');

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

                return event.addCurrency(User, Currency, value)
                    .then(event.addBadges(req));
            }).then(function (result) {
                return res.send({ earned: result.length, rules: result });
            },function (err) {
                console.error('err', err.stack);
                return res.send(500, err);
            })
            .done();
    });

};