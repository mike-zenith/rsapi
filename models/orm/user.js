'use strict';

var models = require ('../../lib/service/models');

module.exports = function (db) {

    db.define('user', {
        credits: { type: 'integer', size: 4, defaultValue: 0}
    }, {
        methods: {
        }
    });

    return function (db) {
        db.models.user.hasMany(
            'currencies',
            db.models.currency,
            { value: { type: 'integer', size: 4 } },
            { reverse: 'user' });

        db.models.user.hasMany(
            'badges',
            db.models.rule,
            {
                date: {type: 'date', time: true},
                claimed: {type: 'boolean', defaultValue: false},
                claimed_date: {type: 'date', time: true}
            },
            {
                reverse: 'user',
                mergeAssocId: 'rule_id',
                hooks: {
                    beforeSave: function (extra, next) {
                        // @todo composite unique key test
                        if (!extra || !extra.rule_id) {
                            return next();
                        }
                        next();
                    }
                }
            });

    };
};