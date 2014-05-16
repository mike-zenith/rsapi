'use strict';

module.exports = function (app) {

    app.get('/', function (q, s) {
        var opts = {
            version: "1.2",
            href: "http://vnd.controller",
            items: [
                { foo: "bar" }
            ]
        };
        s.send(opts);
    });

};