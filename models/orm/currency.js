'use strict';

module.exports = function (db) {
    db.define('currency', {
        name: { type: 'text', size: 64 },
        type: { type: 'integer', size: 2, defaultValue: 0 },
        disabled: { type: 'boolean', defaultValue: false }
    }, {
        methods: {
        }
    });

};