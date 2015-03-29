"use strict";

var request = require('request');
var async = require('async');
var debug = require('debug')('probe:request');

module.exports = function (urls, match, callback){
    var report = [],
        probeErrors = [];

    debug('urls %s', urls);

    async.each(urls, function(url, next){
        if (match) {
            request({url: (url.indexOf('//')==0 ? 'http:' + url : url), timeout: 2000}, function (error, response, body) {
                if (error) {
                    probeErrors.push({
                        url: url,
                        error: error
                    });
                    next();
                    return;
                }

                if (response.statusCode != 200) {
                    probeErrors.push({
                        url: url,
                        statusCode: response.statusCode
                    });
                    next();
                    return;
                }

                report.push({
                    url: url,
                    isMatch: match(response, body)
                });

                next();
            });
        } else {
            report.push({
                url: url,
                isMatch: false
            });

            next();
        }
    }, function(err){
        callback(err, report, probeErrors);
    });
};