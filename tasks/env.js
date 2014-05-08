'use strict';


module.exports = function env(grunt) {
    // Load task
    grunt.loadNpmTasks('grunt-env');

    // Options
    return {
        options: {
        },
        test: {
            NODE_ENV: 'test'
        },
        dev: {
            NODE_ENV: 'development'
        },
        build: {
            NODE_ENV: 'production'
        }
    };
};
