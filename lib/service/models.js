'use strict';

var fs = require('fs'),
    nconf = require('nconf');

module.exports = function (db, cb) {
    var path;
    fs.readdirSync(nconf.get('orm:modelsPath')).forEach(function(file) {
        path = nconf.get('orm:modelsPath') + '/' + file;
        require(path)(db);
    });
    cb(null, db);
};