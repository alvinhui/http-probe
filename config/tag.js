"use strict";

module.exports = [
    {
        name: 'Javascript',
        reg: /<script .*?src=(['"])(.*?)\1.*?>/g,
        match: function(response, body){
            return body.match(/http:\/\//) ? true : false;
        }
    },
    {
        name: 'CSS',
        reg: /<link .*?href=(['"])(.*?)\1.*?>/g,
        match: function(response, body){
            return body.match(/http:\/\//) ? true : false;
        }
    },
    //{
    //    name: 'Image',
    //    reg: /<img .*?src=(['"])(.*?)\1.*?>/g
    //},
    //{
    //    name: 'Link',
    //    reg: /<a .*?href=(['"])(.*?)\1.*?>/g
    //}
];