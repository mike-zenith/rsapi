'use strict';

module.exports = function () {
    return function (err, req, res, next) {
        if (!err) {
            return next();
        }
        console.info(err.stack);
        res.send(500, err);
    };
};