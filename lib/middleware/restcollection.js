'use strict';

var service = require('../service/i18n'),
    nconf = require('nconf');

module.exports = function () {
    var i18nService = new service();

    return function (req, res, next) {
        var lang = i18nService.languageFromRequest(req);
        lang = lang || nconf.get('i18n:fallback');
        res.locals.context = {
            locality: lang
        };

        next();
    };
};