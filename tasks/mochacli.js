'use strict';


module.exports = function mochacli(grunt) {
	// Load task
	grunt.loadNpmTasks('grunt-mocha-cli');

	// Options
	return {
	    options: {
	        timeout: 5000,
            colors: true,
            recursive: false,
	        'check-leaks': true,
	        ui: 'bdd',
            debug: true,
            'debug-brk': false,
	        reporter: 'spec',
            files: ['test/*.js', 'test/lib/*.js']
	    },
        spec: {
            options: {
                reporter: 'spec'
            }
        },
        nyan: {
            options: {
                reporter: 'nyan'
            }
        },
        min: {
            options: {
                reporter: 'min'
            }
        },
        quiet: {
            options: {
                repoter: 'min',
                quiet: true
            }
        }

	};
};
