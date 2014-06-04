'use strict';

module.exports = function (db) {

    var User = db.define('user', {
        credits: { type: 'integer', size: 4, defaultValue: 0}
    }, {
        methods: {
        }
    });

    User.hasMany(
        'currencies',
        db.models.currency,
        { value: { type: 'integer', size: 4 } },
        { reverse: 'users'});

    User.hasMany(
        'badges',
        db.models.badge,
        {
            date: {type: 'date', time: true},
            claimed: {type: 'boolean', defaultValue: false},
            claimed_date: {type: 'date', time: true}
        },
        { reverse: 'users'});
};