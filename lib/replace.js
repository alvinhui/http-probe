"use strict";

var misc = require('./util/misc');

module.exports = function (url, replaces){
    replaces.forEach(function(replace){
        var rule;

        for (var i in replace.from) {
            rule = replace.from[i];
            if (typeof rule == 'string') {
                url = misc.matchAll(rule, url, replace.to);
            } else {
                url = misc.match(rule, url, replace.to);
            }
        }
    });

    return url;
};