"use strict";

var path = require('path');

var config = [
    {

        // 需要查找的文件夹，绝对路径
        dirs: [
            path.join(process.cwd(), 'test', 'files', '1')
        ],

        // 需要查找的文件后缀
        types: ['vm', 'html'],

        //如果 URL 存在以下关键字，则不进行探测
        ignores: [
            'ignoreme'
        ],

        //如果 URL 中存在 from 的关键字，则进行替换成 to
        replaces: [
            {
                from: ['$!{uiModule}', '$!{guiModule}'],
                to: 'http://g.tbcdn.cn'
            }
        ]
    }, {
        dirs: [
            path.join(process.cwd(), 'test', 'files', '2')
        ],
        type: ['xtpl']
    }
];

module.exports = config;