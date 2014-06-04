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

strategyInterface.prototype.send = function (service, options) {
    service.register(this.register, options);
};

module.exports = strategyInterface;