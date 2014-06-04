'use strict';

module.exports = function (db) {

    var Badge = db.define('badge', {
        name: { type: 'text', size: 64 },
        image: { type: 'text', size: 128 }
    }, {
        methods: {
        }
    });


    Badge.hasMany(
        'rules',
        db.models.rule,
        { level: {type: 'integer', size: 1} },
        { reverse: 'badge'});
};