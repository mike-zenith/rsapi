var Q = require('q'),
    modelService = require('../../lib/service/models'),
    options = {
        'modelsPath': process.cwd() + '/models/orm'
    };

exports.up = function(next){
    modelService.load(options, this.task.orm, function (err, db) {
        db.sync(next);
    });
};

exports.down = function(next){
    modelService.load(options, this.task.orm, function (err, db) {
        db.drop(next);
    });
};
