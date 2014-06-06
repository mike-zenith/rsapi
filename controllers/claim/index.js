'use strict';

var model = require('../../lib/service/models'),
    util = require('util');


function NotFoundBadgeError() {
    this.code = 404;
}
function AlreadyClaimedError() {
    this.code = 409;
}
function NotFoundRuleError() {
    this.code = 404;
}

module.exports = function (router) {

    router.post('/', function (req, res) {
        var data = req.body,
            user;

        if (!data.user_id || !data.rule_id || !data.badge_id) {
            return res.send(400, {
                request: data,
                error: [
                    {message: 'Parameters missing'}
                ]
            });
        }

        model.find.immediate.one(req, 'user', data.user_id).then(function (User) {
            user = User;
            return model.immediate(User, 'getBadges', {
                rule_id: data.rule_id
            });
        }).then(function (Rule_) {
            if (!Rule_.length) {
                throw new NotFoundBadgeError();
            }
            var Rule = Rule_[0];
            if (Rule.claimed) {
                throw new AlreadyClaimedError();
            } else {
                Rule.extra.claimed = true;
                Rule.extra.claimed_date = new Date();
                return model.immediate(Rule, 'save');
            }
        }).then(function (Rule) {
            var credit_value;
            if (!Rule || !Rule.credit_value) {
                throw new NotFoundRuleError();
            }
            credit_value = Rule.credit_value;
            user.credits += credit_value;
            return model.immediate(user, 'save');
        }).then(function () {
            res.send(200);
        }, function (e) {
            res.send(e.code);
        });
    });

};