'use strict';

var fs = require('fs');

module.exports = function (config, db, cb) {
    var path;
    fs.readdirSync(config.modelsPath).forEach(function(file) {
        path = config.modelsPath + '/' + file;
        require(path)(db);
    });
    cb(null, db);
};