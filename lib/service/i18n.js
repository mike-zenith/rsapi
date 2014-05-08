'use strict';

var util = require('util');

function i18n() {

}

i18n.prototype.languageFromRequest = function (req) {
    var lang = null;

    if (req && req.acceptsLanguage) {
        return req.acceptsLanguage;
    }

    if (req && req.headers) {
        lang = this.languageFromHeaders(req.headers);
    }
    if (!lang && req.connection && req.connection.remoteAddress) {
        lang = this.languageFromRemoteAddress(req.connection.remoteAddress);
    }
    if (!lang && req.acceptedLanguages) {
        lang = this.isAcceptedLanguage(req.acceptedLanguages);
    }

    return lang;
};

i18n.prototype.isAcceptedLanguage = function(language) {
    var l = util.isArray(language) ? language : [language],
        i;
    for(i = 0; i < l.length; i++) {
        if (~this.acceptedLanguages.indexOf(l[i])) {
            return this.localeToLanguage(this.acceptedLanguages.indexOf(l[i]));
        }
    }
    return null;
};

i18n.prototype.languageFromHeaders = function (httpHeaders) {
    if (httpHeaders && httpHeaders['Accept-Language']) {
        return this.localeToLanguage(httpHeaders['Accept-Language']);
    }

    return null;
};

i18n.prototype.languageFromRemoteAddress = function (remote) {
    return null;
};

i18n.prototype.localeToLanguage = function(loc) {
    return loc.replace(/_/gi,'-');
};

module.exports = i18n;