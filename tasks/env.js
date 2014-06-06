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
        local: {
            NODE_ENV: 'development'
        },
        dev: {
            NODE_ENV: 'development'
        },
        build: {
            NODE_ENV: 'production'
        }
    };
};
