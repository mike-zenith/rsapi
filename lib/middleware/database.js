'use strict';

var orm = require('orm'),
    nconf = require('nconf'),
    modelsService = require('../service/models');

module.exports =  function () {
    return orm.express(nconf.get('orm:uri'), {
        define: function (db, models, next) {
            modelsService(db, function (err, db) {
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