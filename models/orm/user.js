'use strict';

module.exports = function (db) {

    var User = db.define('user', {
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
        { date: {type: 'date', time: true} },
        { reverse: 'users'});
};