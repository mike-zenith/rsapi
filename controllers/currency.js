'use strict';

module.exports = function (app) {
    app.param('currency_id', function (req, res, next, id) {
        req.models.currency.get(id, function (err, record) {
            if (err && ~err.toString().indexOf('ORMError')) {
                if (err.code === 2) {
                    res.send(404);
                    next();
                    return;
                }
            }
            if (err) {
                res.json(500, err);
                next();
                return;
            }
            req.currency = record;
            next();
        });
    });

};
