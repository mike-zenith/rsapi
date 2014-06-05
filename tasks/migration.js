'use strict';

var runner = require('./../lib/task/db'),
    config = require('kraken-js/lib/config');

module.exports = function migration(grunt) {
    // Load task
    grunt.registerTask('migration', 'Set a migration operation', function (operation) {
        var cfgPath,
            done = this.async(),
            that = this;

        cfgPath = grunt.option('config-path') || process.cwd();
        if (grunt.file.isDir(cfgPath)) {
            config.create({ basedir: cfgPath, protocols: []}).then(function (nconf) {
                var connect = nconf.get('database:connect'),
                    options;
                options = that.options({
                    'connect': connect
                });
                runner(operation, options, grunt, done);
            });
        }
    });
};
