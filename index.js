'use strict';


var kraken = require('kraken-js'),
    orm = require('orm'),
    util = require('util'),
    error = require('./lib/middleware/error'),
    middleware = require('./lib/service/middleware'),
    nconf = require('nconf'),
    app = {};


app.before = [];

app.configure = function configure(nconf, next) {
    // Async method run on startup.
    var settings = nconf.get('orm:settings');

    Object.keys(settings).forEach(function (i) {
        orm.settings.set(i, settings[i]);
    });

    next(null);
};


app.requestStart = function requestStart(server) {
    // Run before most express middleware has been registered.
};


app.requestBeforeRoute = function requestBeforeRoute(server) {

    middleware(nconf.get('middleware:custom'), server);

    if (app.before) {
        app.before.forEach(function (el) {
            server.use(el);
        });
    }
};


app.requestAfterRoute = function requestAfterRoute(server) {
    server.use(error());
};


if (require.main === module) {
    kraken.create(app).listen(function (err, server) {
        if (err) {
            console.error(err.stack);
        }
    });
}


module.exports = app;
