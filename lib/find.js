"use strict";

var fs = require('fs');
var jschardet = require('jschardet');
var iconv = require('iconv-lite');
var async = require('async');
var validator = require('validator');
var request = require('./request');
var replace = require('./replace');
var ignore = require('./ignore');

var charsetRectifier = {
    'GB2312' : 'gbk'
};

/**
 *
 * @param file {String} 文件名，绝对路径
 * @param config {Object} 配置 {charset: '', ignores: [], replaces: [], tags: []}
 * @param callback {Function} 回调函数
 */
module.exports = function (file, config, callback) {
    var errorURLs = [],
        ignoreURLs = [],
        errorProbes = [],
        probeURLs = [],
        allURLs = [];

    // allURLs = (probeURLs + errorProbes) + errorURLs + ignoreURLs

    var content = fs.readFileSync(file),
        detectRes,
        fileCharset;

    if( ! content || content && content.length === 0){
        callback(file, allURLs, probeURLs, errorURLs, ignoreURLs, errorProbes);
        return;
    }

    if( ! config.charset){
        detectRes = jschardet.detect(content);
        if(charsetRectifier[detectRes.encoding]){
            fileCharset = charsetRectifier[detectRes.encoding];
        }
        else{
            fileCharset = detectRes.encoding;
        }
    }
    else{
        fileCharset = config.charset;
    }

    content = iconv.decode(content, fileCharset);

    async.each(config.tags, function(tag, next){
        var urls = [];
        content.replace(tag.reg, function (_1, _2, url) {
            allURLs.push(url);

            if ( ! ignore(url, config.ignores)) {
                url = replace(url, config.replaces);

                if(validator.isURL(url, {allow_protocol_relative_urls: true})){
                    urls.push(url);
                }else{
                    errorURLs.push(url);
                }
            } else {
                ignoreURLs.push(url);
            }
        });

        if (urls.length > 0){
            request(urls, tag.match, function(err, urlReport, probeErrors){
                if(err) return next(err);

                if (urlReport.length > 0) {
                    probeURLs = probeURLs.concat(urlReport);
                }

                if (probeErrors.length > 0) {
                    errorProbes = errorProbes.concat(probeErrors);
                }

                next();
            });
        } else {
            next();
        }
    }, function (err) {
        callback(err, file, allURLs, probeURLs, errorURLs, ignoreURLs, errorProbes);
    });

};