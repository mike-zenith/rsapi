'use strict';

var fs = require('fs'),
    util = require('util'),
    path,
    ex = {},
    generatorClass,
    generator,
    generatorStrategy = require('./strategy');

fs.readdirSync(__dirname).forEach(function(file) {
    if (file === 'index.js' || file === 'strategy.js') {
        return;
    }
    generatorClass = require(__dirname + '/' + file);

    if ({}.toString.call(generatorClass) !== '[object Function]') {
        console.error('Not function', file);
        return;
    }

    generator = new generatorClass();
    if (generator instanceof generatorStrategy ) {
        ex[generator.register] = generator;
    } else {
        console.error('Not instance', generatorClass.super_, generatorStrategy);
    }
});

module.exports = ex;