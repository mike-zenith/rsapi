'use strict';

var extend = require('node.extend'),
    util = require('util'),
    ormHelper = require('./vndcollection/orm');

function vnd(){

}

vnd.prototype.orm = ormHelper;

vnd.prototype.itemSkeleton = function (options) {
    var skeleton = {
            href: 'http://:id',
            data: [],
            links: []
        };

    if (!options) {
        return skeleton;
    }

    if (util.isArray(options)) {
        return options.map(this.skeleton);
    }
    options.href && (skeleton.href = options.href);
    options.links && (skeleton.links = options.links);

    if (!options.items && !options.href) {
        options = { items: options };
    }

    if (util.isArray(options.items)) {
        return options.items.map(function (el) {
            var config = skeleton;
            config.items = el;
            return this.itemSkeleton(config);
        }.bind(this));
    }
    options.items && this.applyItems(options.items, skeleton);

    return skeleton;

};

vnd.prototype.applyItems = function (items, skeleton) {
    var isPrimaryKey = function (item) {
            return item.name === '_id' || item.name === 'id';
        },
        generateHref = function (p, id) {
            return p.replace(/:id/gi, id.value);
        },
        pk;

    skeleton.data = this.orm.toTemplate(items, true);
    skeleton.href = (pk = skeleton.data.filter(isPrimaryKey))
        .length ?
            pk.reduce(generateHref, skeleton.href) :
            generateHref(skeleton.href, skeleton.data[0]);

    this.applyLinks(items, skeleton);
};

vnd.prototype.applyLinks = function (items, skeleton) {
    skeleton.links || (skeleton.links = []);

    if (this.orm.isRecord(items)) {
        var assocs = this.orm.associations(items),
            assoc,
            ind;
        for(ind in assocs) {
            assoc = assocs[ind];
            skeleton.links.push({
                rel: assoc.name,
                href: '+/' + assoc.name,
                prompt: assoc.name
            });
        }
    }

    if (skeleton.links) {
        util.isArray(skeleton.links) || (skeleton.links = [skeleton.links]);
        skeleton.links = skeleton.links.map(function (cb) {
            var data;
            if ({}.toString.call(cb) === '[object Function]') {
                data = cb(skeleton.data);
            } else {
                data = cb;
            }
            data.prompt || (data.prompt = data.rel);
            data.href || (data.href = '+/' + data.rel);
            if (data.href) {
                data.href = data.href[0] === '+' ?
                    skeleton.href + data.href.substr(1) :
                    data.href;
            }
            return data;
        });
    }
};

vnd.prototype.skeleton = function (options) {
    var skeleton = {
            collection: {
                version: '1.0',
                href: 'http://href',
                links: [],
                items: [],

                queries: [],
                template: []
            }
        },
        that = this,
        href;

    if (options) {
        skeleton.collection = extend(true, {}, skeleton.collection, options);
        // extend converts oour Models to plain objects
        options.items && (skeleton.collection.items = options.items);
    }

    if (skeleton.collection.items) {
        if (skeleton.collection.itemHref) {
            href = skeleton.collection.itemHref;
            delete skeleton.collection.itemHref;
        } else {
            href = skeleton.collection.href + '/:id';
        }
        skeleton.collection.items = skeleton.collection.items.map(function (el) {
            return that.itemSkeleton({
                href: href,
                items: el
            });
        });
        if (skeleton.collection.items[0]) {
            skeleton.collection.template = {
                data: skeleton.collection.items[0].data.map(function (d) {
                    return extend(true, {}, d, { value: ''});
                })
            };
        }
    }

    return skeleton;

};

module.exports = vnd;