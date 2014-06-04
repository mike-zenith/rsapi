'use strict';

var service = require('../service/errorhandler');

module.exports = function (config) {
    var handler = new service(config);

    return handler.handle.bind(handler);
};