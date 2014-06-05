'use strict';

module.exports = function (db) {

    db.define('badge', {
        name: { type: 'text', size: 64 },
        image: { type: 'text', size: 128 }
    }, {
        methods: {
        }
    });
};