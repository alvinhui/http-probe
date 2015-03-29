"use strict";

function match (replaceThis, inThis, withThis){
    var match = inThis.match(replaceThis);

    if (match) {
        for (var j = 0, l = match.length; j<l; j++) {
            if(withThis) {
                inThis = inThis.replace(match[j], withThis);
            }
        }
    }

    if (withThis) {
        return inThis;
    } else {
        return match;
    }
}

exports.inArray = function(arr, val) {
    arr = arr || [];
    var len = arr.length;
    var i;

    for (i = 0; i < len; i++) {
        if (arr[i] === val) {
            return true;
        }
    }
    return false;
};

exports.matchAll = function (replaceThis, inThis, withThis) {

    if (withThis) {
        withThis = withThis.replace(/\$/g,"$$$$");
    }
    return match(new RegExp(replaceThis.replace(/([\/\,\!\\\^\$\{\}\[\]\(\)\.\*\+\?\|<>\-\&])/g,"\\$&"),"g"), inThis, withThis);
};

exports.match = function (replaceThis, inThis, withThis) {
    return match(replaceThis, inThis, withThis);
};