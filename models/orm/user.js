'use strict';

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
            { reverse: 'users', hooks: {
                beforeSave: function (extra, next) {
                    console.log('OKE?');
                    return next();
                }
            }});

        db.models.user.hasMany(
            'badges',
            db.models.badge,
            {
                date: {type: 'date', time: true},
                claimed: {type: 'boolean', defaultValue: false},
                claimed_date: {type: 'date', time: true}
            },
            { reverse: 'users'});
    };
};