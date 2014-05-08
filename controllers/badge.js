'use strict';

module.exports = function (app) {
    app.param('badge_id', function (req, res, next, id) {
        req.models.badge.get(id, function (err, record) {
            if (err) {
                res.json(500, err);
                next();
            }
            if (!record) {
                res.send(404);
                next();
            }
            req.badge = record;
            next();
        });
    });

    app.get('/badge', function (req, res) {
        req.models.badge.all(function (err, badges) {
            if (err) {
                console.log(err);
                res.send(500, err);
                return;
            }
            res.send(badges);
        });
    });

    app.post('/badge', function (req, res) {
        req.models.badge.create(req.body, function (err, badge) {
            if (err) {
                res.send(500, err);
                return;
            }
            res.send(badge);
        });
    });

    app.get('/badge/:badge_id', function (req, res) {
            res.json(req.badge);
    });

    app.put('/badge/:badge_id', function (req, res) {
        if (!req.body) {
            res.send(400);
            return;
        }
        var badge = req.badge;
        Object.keys(req.body).forEach(function (key) {
            badge[key] = req.body[key];
        });

        req.badge.save(function (err) {
            if (err) {
                res.json(500, err);
                return;
            }
            res.send(200, req.badge);
        });
    });

    app.delete('/badge/:badge_id', function (req, res) {
        req.badge.remove(function (err) {
            if (err) {
                res.json(500, err);
                return;
            }
            res.send(204);
        });
    });

};
