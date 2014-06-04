'use strict';

var runner = require('./../lib/task/db'),
    config = require('kraken-js/lib/config');

module.exports = function migration(grunt) {
    // Load task
    grunt.registerTask('migration', 'Set a migration operation', function (operation) {
        var cfgPath,
            done = this.async(),
            options,
            connect,
            nconf;

        cfgPath = grunt.option('config-path') || 'config';
        if (grunt.file.isDir(cfgPath)) {
            nconf = config.create(__dirname + '/../');
            connect = nconf.get('orm:connect');
        }

        options = this.options({
            'connect': connect
        });
        runner(operation, options, grunt, done);
    });
};
