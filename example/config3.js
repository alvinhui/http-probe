"use strict";

var path = require('path');

var config = {

    // 需要查找的文件夹，绝对路径
    dirs: [
        path.join(process.cwd(), 'test', 'files', '3')
    ],

    // 需要查找的文件后缀
    types: ['html'],

    tags: [
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