'use strict';

var MigrationTask = require('migrate-orm2'),
    orm = require('orm'),
    path  = require('path');

module.exports = function (operation, options, grunt, done) {
    orm.settings.set('connection.debug', true);
    orm.connect(options.connect, function (err, connection) {
        if (err) {
            throw(err);
        }

        var migrationTask = new MigrationTask(
            connection.driver,
            { dir: './data/migrations', orm: connection}
        );
        migrationTask[operation](options.file || grunt.option('file'), done);
    });
};