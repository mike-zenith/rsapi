'use strict';


var kraken = require('kraken-js'),
    app = require('express')(),
    options = require('./lib/spec')(app),
    port = process.env.PORT || 8001;

app.use(kraken(options));

module.exports = app.listen(port, function (err) {
    if (err) {
        console.error(err.stack);
    }
});