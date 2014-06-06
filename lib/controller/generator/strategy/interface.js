'use strict';


function strategyInterface() {
}

Object.defineProperty(strategyInterface.prototype, 'register', {
    enumerable: false,
    writable: false,
    value: 'strategy'
});

strategyInterface.prototype.build = function (service) {};

strategyInterface.prototype.generate = function (router) {};

module.exports = strategyInterface;