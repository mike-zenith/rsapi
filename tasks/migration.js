'use strict';

var runner = require('./../lib/task/db'),
    config = require('kraken-js/lib/util/configutil');

module.exports = function migration(grunt) {
    // Load task
    grunt.registerTask('migration', 'Set a migration operation', function (operation) {
        var cfgPath,
            done = this.async(),
            options,
            uri,
            nconf;

        cfgPath = grunt.option('config-path') || 'config';
        if (grunt.file.isDir(cfgPath)) {
            nconf = config.create(__dirname + '/../');
            uri = nconf.get('orm:uri');
        }

        options = this.options({
            'uri': uri
        });
        runner(operation, options, grunt, done);
    });
};
