'use strict';


function strategy() {
}

Object.defineProperty(strategy.prototype, 'register', {
    enumerable: false,
    writable: false,
    value: 'strategy'
});


strategy.prototype.generate = function (app, service) {};

module.exports = strategy;