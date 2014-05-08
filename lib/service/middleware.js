'use strict';


module.exports = function (config, server) {
    var fn;
    Object.keys(config).forEach(function (name) {
        fn = require(config[name]);
        server.use(fn());
    });
};