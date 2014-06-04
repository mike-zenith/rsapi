'use strict';

var express = require('express');


function removeRoute(routes, verb, uri) {
    verb = verb.toLowerCase();
    verb = verb === 'del' ? 'delete' : verb;
    if (routes && routes[verb]) {
        for(var i = 0, len = routes[verb].length, route; i < len; i++) {
            route = routes[verb][i];
            if (route.path === uri && route.method === verb) {
                route.callbacks = [];
                delete routes[verb][i];
                route = void 0;
                routes[verb].splice(i, 1);
                i++;
            }
        }
    }
    return false;
}

module.exports = function (config) {
    return function appoverwrite (q, s, next) {
        var app = q.app;
        if (!app.overwrite) {
            app.overwrite = function (verb_, uri_, callback_) {
                var verb, uri, tmp, callback;
                if (arguments.length > 2) {
                    verb = verb_;
                    uri = uri_;
                    callback = callback_;
                } else {
                    tmp = verb_.indexOf(' ');
                    verb = verb_.substr(0, tmp);
                    uri = verb_.substr(tmp+1);
                    callback = uri_;
                }

                if (!verb || !uri || !callback) {
                    throw new Error('Invalid argument exception: verb, uri or callback missing');
                }

                verb = verb.toLowerCase();
                verb = verb === 'delete' ? 'del' : verb;
                app.routes && app.routes[verb] && removeRoute(app.routes, verb, uri);

                app[verb](uri, callback);
            };
        }

        next();
    };
};
