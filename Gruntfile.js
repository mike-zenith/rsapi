'use strict';


module.exports = function (grunt) {

    // Load the project's grunt tasks from a directory
    require('grunt-config-dir')(grunt, {
        configDir: require('path').resolve('tasks')
    });

    var env = grunt.option('environment') || 'build';

    // Register group tasks
    grunt.registerTask('build', [ 'env:build', 'jshint', 'less', 'copyto', 'i18n' ]);
    grunt.registerTask('test', [ 'env:test', 'jshint', 'mochacli', 'clean:tmp' ]);

    grunt.registerTask('migrate:generate', ['env:' + env, 'migration:generate']);
    grunt.registerTask('migrate:up', ['env:' + env, 'migration:up']);
    grunt.registerTask('migrate:down', ['env:' + env, 'migration:down']);

};
