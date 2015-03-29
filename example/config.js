"use strict";

var path = require('path');

var config = {

    // {Array} 需要查找的文件夹，绝对路径
    dirs: [
        path.join(process.cwd(), 'test', 'files', '1')
    ],

    // {Array} 文件夹如果包含以下关键字则会被忽略
    dirFilters: ['Temp', '_Temp'],

    // {Array} 需要查找的文件后缀
    types: ['vm', 'html'],

    // {Array} 如果 URL 存在以下关键字，则不进行探测；
    ignores: [
        'ignoreme',

        //可以是正则
        /iamatestfile/
    ],

    //如果 URL 中存在 from 的关键字，则进行替换成 to；
    replaces: [
        {
            from: ['$!{uiModule}', '$!{guiModule}'],
            to: 'http://g.tbcdn.cn'
        },

        // 匹配所有以 tbra-aio.js 结尾的 url ，替换成 tbra-aio.source.js
        {
            //可以是正则
            from: [/tbra-aio\.js$/],

            //String.repace 的回调函数
            to: function(){
                return 'tbra-aio.source.js';
            }
        }
    ],

    //可以自定义在文件内需要匹配的内容（必须是 URL），以及探测时想要探测的内容（不传的话默认匹配模板内通过 `<script src="">` 和 `<link href="">` 方式加载的资源，并检测该资源的源码内是否存在 `http://` 关键字）
    tags: [

        // 匹配模板内通过 `<script src="">` 方式加载的脚本并检查该脚本内是否存在 http:// 关键字
        {
            name: 'Javascript',
            reg: /<script .*?src=(['"])(.*?)\1.*?>/g,
            match: function(response, body){
                return body.match(/http:\/\//) ? true : false;
            }
        },

        // 匹配模板内通过 `<link href="">` 方式加载的资源并检查该资源内是否存在 http:// 关键字
        {
            name: 'CSS',
            reg: /<link .*?href=(['"])(.*?)\1.*?>/g,
            match: function(response, body){
                return body.match(/http:\/\//) ? true : false;
            }
        },

        // 匹配模板内通过 `<test link="">` 方式加载的资源并检查该资源内是否存在 KISSY 关键字
        {
            name: 'Test',
            reg: /<test .*?link=(['"])(.*?)\1.*?>/g,
            match: function(response, body){
                return body.match(/KISSY/) ? true : false;
            }
        }
    ]
};

module.exports = config;