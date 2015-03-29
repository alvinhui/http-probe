"use strict";

var _ = require('underscore');
var types = require('./config/type');
var tags = require('./config/tag');
var walk = require('./lib/walk');
var find = require('./lib/find');

var log = function (){
    console.log.apply(console, arguments);
};

function fixConfig(config) {
    config.types =  _.isArray(config.types) ? config.types : types;
    config.ignores = _.isArray(config.ignores) ? config.ignores : [];
    config.tags = _.isArray(config.tags) ? config.tags : tags;
    config.replaces = _.isArray(config.replaces) ? config.replaces : [];
    config.dirs = _.isArray(config.dirs) ? config.dirs : [process.cwd()];
    config.dirFilters = _.isArray(config.dirFilters) ? config.dirFilters : [];

    return config;
}

exports.run = function(config, callback) {
    var report = {
        errorURLs : [], // 所有错误的 URL
        ignoreURLs : [], // 所有忽略掉的 URL
        errorProbes: [], // 所有探测失败的 URL
        probeURLs : [], // 所有探测过的 URL
        allURLs: [] // 所有匹配到的 URL
    };

    config = fixConfig(config);
    walk(config, function(file, nextFile){
        find(file, config, function (err, file, allURLs, probeURLs, errorURLs, ignoreURLs, errorProbes){
            if(err) return nextFile(err);

            if (allURLs.length > 0) {
                report.allURLs = report.allURLs.concat(allURLs);
            }

            if (probeURLs.length > 0) {
                report.probeURLs.push({
                    file: file,
                    urls: probeURLs
                });
            }

            if (errorURLs.length > 0) {
                report.errorURLs.push({
                    file: file,
                    urls: errorURLs
                });
            }

            if (ignoreURLs.length > 0) {
                report.ignoreURLs.push({
                    file: file,
                    urls: ignoreURLs
                });
            }

            if (errorProbes.length > 0) {
                report.errorProbes.push({
                    file: file,
                    urls: errorProbes
                });
            }

            nextFile();
        });
    }, function(err) {
        callback(err, report);
    });
};

exports.report = function(report) {
    log('\n');
    log('# Report');

    var countProbeURLs = 0;
    if (report.probeURLs.length > 0) {
        log('\n');
        log('## 已探测的 URL');

        report.probeURLs.forEach(function(probeURL){
            log('\n');
            log(probeURL.file);
            log('\n');

            probeURL.urls.forEach(function(urlReport){
                log(' * ' + urlReport.url + ' | 匹配到目标： ' + '**'+urlReport.isMatch+'**');

                countProbeURLs++;
            });
        });
    }

    var countErrorURLs = 0;
    if (report.errorURLs.length > 0) {
        log('\n\n\n\n');
        log('## 错误的 URL');

        report.errorURLs.forEach(function(errorURLsReport){
            log('\n');
            log(errorURLsReport.file);
            log('\n');

            errorURLsReport.urls.forEach(function(url){
                log(' * ' + url);

                countErrorURLs++;
            });
        });
    }

    var countErrorProbes = 0;
    if (report.errorProbes.length > 0) {
        log('\n\n\n\n');
        log('## 探测失败的 URL');

        report.errorProbes.forEach(function(errorProbesReport){
            log('\n');
            log('### ' + errorProbesReport.file);

            errorProbesReport.urls.forEach(function(urlReport){
                log(' * ' + urlReport.url + ' | 失败原因：' + (urlReport.error ? urlReport.error :  '返回statusCode为' + urlReport.statusCode ));

                countErrorProbes++;
            });
        });
    }

    var countIgnoreURLs = 0;
    if (report.ignoreURLs.length > 0) {
        log('\n\n\n\n');
        log('## 忽略掉的 URL');

        report.ignoreURLs.forEach(function(ignoreURLsReport){
            log('\n');
            log(ignoreURLsReport.file);
            log('\n');

            ignoreURLsReport.urls.forEach(function(url){
                log(' * ' + url);

                countIgnoreURLs++;
            });
        });
    }

    log('\n');
    log('>> 在文件中总共匹配到 URL ：' + report.allURLs.length + '个');
    log('>> ');
    log('>> 需要进行探测的 URL 有：' + (countProbeURLs + countErrorProbes) + '个');
    log('>> ');
    log('>>>> 探测成功的 URL 有：' + countProbeURLs + '个');
    log('>>>> ');
    log('>>>> 探测失败的 URL 有：' + countErrorProbes + '个');
    log('>> ');
    log('>> 错误的 URL 有：' + countErrorURLs + '个');
    log('>> ');
    log('>> 已忽略的 URL 有：' + countIgnoreURLs + '个');
    log('>> ');
    log('>> Done!!!');
};

