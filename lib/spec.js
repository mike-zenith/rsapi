'use strict';

var orm = require('orm');

module.exports = function spec(app) {
    return {
        onconfig: function (config, next) {
            config.get('view engines:js:renderer:arguments').push(app);

            process.setMaxListeners(20);

            next(null, config);
        }
    };
};