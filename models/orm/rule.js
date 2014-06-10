'use strict';

module.exports = function (db) {

    db.define('rule', {
        disabled: { type: 'boolean', defaultValue: false },
        currency_value: { type: 'integer', size: 4, required: true },
        credit_value: { type: 'integer', size: 4, required: true },
        level: { type: 'integer', size: 2, defaultValue: 1 },
        name: { type: 'text', size: 32 },
        activeFrom: { type: 'date', time: true },
        activeUntil: { type: 'date', time: true }
    }, {
        methods: {
        }
    });

    return function (db) {
        db.models.rule.hasOne(
            'parent',
            db.models.rule,
            { field: 'parent_id' });

        db.models.rule.hasOne(
            'badge',
            db.models.badge,
            { field: 'badge_id', reverse: 'rules' });

        db.models.rule.hasOne(
            'currency',
            db.models.currency,
            { field: 'currency_id', reverse: 'rules' });
    };
};