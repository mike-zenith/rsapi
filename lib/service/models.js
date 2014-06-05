'use strict';

var fs = require('fs'),
    Q = require('q'),
    QMethods = require('./models/qmethods');

var service = QMethods;
service.load =  function (config, db, cb) {
    var path, definition, dfd = Q.defer(), promise = dfd.promise;
    fs.readdirSync(config.modelsPath).forEach(function(file) {
        path = config.modelsPath + '/' + file;
        definition = require(path);
        if ({}.toString.call(definition) === '[object Function]') {
            promise.then(definition(db));
        }
    });
    promise.then(function () {
        cb(null, db);
    }, function (e) {
        cb(e);
    });
    dfd.resolve(db);
};

module.exports = service;

