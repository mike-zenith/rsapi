'use strict';

module.exports = function (app) {
    app.param('user_id', function (req, res, next, id) {
        req.models.user.get(id, function (err, record) {
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
            req.user = record;
            next();
        });
    });

};
