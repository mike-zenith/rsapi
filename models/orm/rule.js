'use strict';

module.exports = function (db) {

    var Rule = db.define('rule', {
        disabled: { type: 'boolean', defaultValue: false },
        currency_value: { type: 'integer', size: 4 },
        credit_value: { type: 'integer', size: 4 },
        name: { type: 'text', size: 32 },
        activeFrom: { type: 'date', time: true },
        activeUntil: { type: 'date', time: true }
    }, {
        methods: {
        }
    });

    Rule.hasOne('parent', Rule, { field: 'parent_id' }, { reverse: 'child' });
    Rule.hasOne('currency', db.models.currency, { field: 'currency_id'});
};