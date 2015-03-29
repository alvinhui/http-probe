"use strict";

var misc = require('./util/misc');

function replace(ignore, content) {
    var res;

    if (typeof ignore == 'string') {
        res = misc.matchAll(ignore, content);
    } else {
        res = misc.match(ignore, content);
    }

    return res;
}

module.exports = function (url, ignores){
    var res = false;

    ignores.forEach(function(ignore){
        if(replace(ignore, url)){
            res = true;
            return false;
        }
    });

    return res;
};