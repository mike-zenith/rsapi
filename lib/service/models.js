'use strict';

var fs = require('fs'),
    QMethods = require('./models/qmethods');

var service = QMethods;
service.load =  function (config, db, cb) {
    var path;
    fs.readdirSync(config.modelsPath).forEach(function(file) {
        path = config.modelsPath + '/' + file;
        require(path)(db);
    });
    cb(null, db);
};

module.exports = service;

