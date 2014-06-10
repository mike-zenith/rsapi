'use strict';

var model = require('../../lib/service/models'),
    util = require('util');


module.exports = function (router) {


    router.post('/', function (req, res) {
        var data = req.body,
            credit;

        if (!data.user_id || !data.credit) {
            return res.send(400, 'Required parameter missing');
        }

        credit = parseInt(data.credit);

        model.find.immediate(req, 'user', data.user_id).then(function (User) {
            var remaining;
            if ( parseInt(User.credits) < credit) {
                return res.send(402, 'Not enough credits');
            }
            remaining = parseInt(User.credits) - data.credit;
            User.credits = remaining;
            model.immediate(User, 'save').then(function() {
                res.send(200, { 'credits': remaining });
            });
        }).fail(function (err) {
            if (err.literalCode === 'NOT_FOUND') {
                model.immediate(req.models.user, 'create', { id: data.user_id, credits: 0})
                    .then(function () {
                        res.send(402, 'Not enough credits');
                    });
            }
            res.send(500, err);
        }).done();

    });
};