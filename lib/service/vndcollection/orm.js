'use strict';

var extend = require('node.extend');

exports.properties = function (model) {
    if (this.isRecord(model)) {
        // @todo add singleton, do not create new model everytime
        return this.properties(model.model());
    }
    return model.allProperties;
};

exports.schema = function (model, includeAssoc) {
    if (includeAssoc) {
        return this.properties(model);
    }
    var props = this.properties(model),
        isAssocField = this.isAssocField,
        final = {};

    Object.keys(props).filter(function (k) {
        if(!isAssocField(props[k])) {
            final[k] = props[k];
        }
    });
    return final;
};

exports.isAssocField = function (fieldData) {
    return (fieldData.klass && ~['hasMany', 'hasOne'].indexOf(fieldData.klass));
};

exports.onlyAssocFields = function (model) {
    if (this.isRecord(model)) {
        var fields = {};
        ['one_', 'many_', 'extend_'].forEach(function (k) {
            var key = k + 'associations';
            model.__opts[key].forEach(function (data) {
                extend(fields, data.field);
            });
        });
        return fields;
    }

    var props = this.properties(model),
        isAssocField = this.isAssocField;
    return Object.keys(props).filter(function (k) {
        return isAssocField(props[k]);
    }).map(function (k) {
        return props[k];
    });
};

exports.isModel = function (model) {
    // @todo solve instanceof problem
    return model && model.allProperties;
};

exports.isRecord = function (model) {
    return model && model.model && model.__opts;
};

exports.toTemplate = function (model, fillValues) {
    var schema, isRecord;
    if (this.isModel(model) || this.isRecord(model)) {
        schema = this.schema(model);
        isRecord = this.isRecord(model);

        return Object.keys(schema).map(function (el) {
            return {
                name: el,
                value: (fillValues && isRecord) ? model[el] : '',
                prompt: el
            };
        });
    }

    return Object.keys(model).map(function (key) {
        var name = key,
            value = fillValues ? model[key] : '',
            data = {name: name, value: value, prompt: name};
        return data;
    });
};

exports.associations = function (model) {
    if (!this.isRecord(model)) {
        throw new Error('Only accepts records, model given');
    }
    var assocs = {};
    ['one', 'many', 'extend'].forEach(function (k) {
        var key = k + '_associations';
        model.__opts[key].forEach(function (data) {
            assocs[data.name] = {
                type: k,
                name: data.name,
                model: data.model,
                field: data.field
            };
        });
    });


    return assocs;
};
