'use strict';

var util = require('util');


module.exports = Reporter;

function Reporter() {

}

Reporter.prototype.error = function (error_) {
    var inspect,
        i = 0;
    if (arguments.length === 1) {
        inspect = error_ && error_.stack ? error_.stack : error_;
    } else {
        inspect = new Array(arguments.length);
        for(; i<arguments.length; i++) {
            inspect.push(arguments[i]);
        }
        inspect = util.inspect(inspect, false, 20);
    }

    console.error(inspect);

};