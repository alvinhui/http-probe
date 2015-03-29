"use strict";

var path = require('path');

var config = {

    // 需要查找的文件夹，绝对路径
    dirs: [
        path.join(process.cwd(), 'test', 'files', '4')
    ],

    // 需要查找的文件后缀
    types: ['html'],

    tags: [
        {
            name: 'Image',
            reg: /<img .*?src=(['"])(.*?)\1.*?>/g,
            match: function(response){
                return response.headers['content-length'] > 10000;
            }
        }
    ]
};

module.exports = config;