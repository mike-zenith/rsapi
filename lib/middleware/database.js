'use strict';

var orm = require('orm'),
    modelsService = require('../service/models');

module.exports = function dbmiddleware(config) {
    return orm.express(config.connect, {
        define: function (db, models, next) {
            modelsService.load(config, db, function (err, db) {
                if (err) {
                    return next(err);
                }
                Object.keys(db.models).forEach(function (i) {
                    models[i] = db.models[i];
                });

                return next();
            });
        }
    });
};