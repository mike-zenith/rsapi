'use strict';

var nconf = require('nconf'),
    confKey = 'output:decorator',
    defaults = {
        'type': 'vnd.collection+json'
    };

function initConfig() {
    var config = nconf.get(confKey);
    if (config) {
        Object.keys(defaults).forEach(function (key) {
            if (false === key in config && key in defaults) {
                nconf.set(confKey + ':' + key, defaults[key]);
            }
        });
    }

    return nconf.get(confKey);
}

function jsonResponse(res) {
    res.type('application/json');
    res.json(res.body);
}

function collectionResponse(res) {
    res.type('vnd.collection+json');
    res.json(res.body);
}

module.exports = function () {
    initConfig();

    return function (req, res, next) {
        res.on('end', function () {
            res.format({
                'text/plain': function () {
                    res.send(406);
                },
                'application/json': jsonResponse(res),
                'vnd.collection+json': collectionResponse(res)
            });
        });
        next();
    };
};