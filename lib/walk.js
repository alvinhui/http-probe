"use strict";

var walk = require('walk');
var path = require('path');
var async = require('async');
var misc = require('./util/misc');

function fixTypes(t){
    var types = [].concat(t);
    types.forEach(function(type, i){
        if(type[0] != '.'){
            types[i] = '.' + type;
        }
    });

    return types;
}

/**
 *
 * @param  config {String} 配置 {dirs: [], type: [], dirFilters: []}
 * @param fileCall {Function} 每个文件的回调函数
 * @param callback {Function} 回调函数
 */
module.exports = function(config, fileCall, callback) {
    var dirs = config.dirs,
        types = fixTypes(config.types);

    async.each(dirs, function(dir, nextDir) {
        var walker = walk.walk(dir, {filters: config.dirFilters});
        walker.on('file', function (root, fileStats, nextFile) {
            var ext = path.extname(fileStats.name);
            if (
                ! ext ||
                ! misc.inArray(types, ext)
            ) {
                nextFile();
                return;
            }

            fileCall(path.join(root, fileStats.name), nextFile);
        });

        walker.on('end', function () {
            nextDir();
        });
    }, function(err) {
        callback(err);
    })
};