    var schema = {
        'badge':  {
            id: { type: 'integer', primary: true, serial: true },
            name: { type: 'text', required: true, size: 64 },
            image: { type: 'text', require: false, size: 128 }
        },
        'currency': {
            id: { type: 'integer', primary: true, serial: true },
            name: { type: 'text', required: true, size: 64 },
            type: { type: 'integer', size: 2, required: true, defaultValue: 0 },
            disabled: { type: 'boolean' }
        },
        'user': {
            id: { type: 'integer', primary: true, serial: true },
            credits: { type: 'integer', required: false, size: 8 }
        },
        'rule': {
            id: { type: 'integer', primary: true, serial: true },
            parent_id: { type: 'integer', required: false },
            currency_id: { type: 'integer' },
            disabled: { type: 'boolean', defaultValue: false },
            currency_value: { type: 'integer', size: 4, required: true },
            credit_value: { type: 'integer', size: 4, required: true },
            name: { type: 'text', size: 32, required: true },
            activeFrom: { type: 'date', time: true },
            activeUntil: { type: 'date', time: true }
        },
        'user_currencies': {
            currencies_id: { type: 'integer', required: true, key: true },
            user_id: { type: 'integer', required: true, key: true},
            value: { type: 'integer', defaultValue: 0, required: true }
        },
        'user_badges': {
            badges_id: { type: 'number', required: true, key: true},
            user_id: { type: 'number', required: true, key: true},
            claimed: { type: 'boolean', defaultValue: false },
            claimed_date: { type: 'date', time: true },
            date: { type: 'date', time: true }
        },
        'badge_rules': {
            badge_id: { type: 'integer', required: true, key: true},
            rules_id: { type: 'integer', required: true, key: true},
            level: { type: 'integer', defaultValue: 1, size: 2 }
        }
    },
    len = Object.keys(schema).length,
    counter = 0,
    e,
    cb = function (next) {
        return function (err) {
            counter ++;
            if (err) {
                console.log(err);
            }
            e = err || e;
            if (counter === len) {
                next(e);
            }
        };
    };


exports.up = function(next){
    var callback = cb(next);

    Object.keys(schema).forEach(function (key) {
        this.createTable(key, schema[key], callback);
    }.bind(this));
};

exports.down = function(next){
    var callback = cb(next);

    Object.keys(schema).forEach(function (key) {
        this.dropTable(key, callback);
    }.bind(this));
};
