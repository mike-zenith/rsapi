'use strict';


function strategyInterface() {
}

Object.defineProperty(strategyInterface.prototype, 'register', {
    enumerable: false,
    writable: false,
    value: 'strategy'
});

strategyInterface.prototype.generate = function (service) {};

module.exports = strategyInterface;