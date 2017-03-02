"use strict";

var TGet = require('./get'),
    TPut = require('./put'),
    TInc = require('./inc'),
    TDel = require('./del'),
    TClient = require('./client'),
    Int64 = require('node-int64');

exports.Get = function(obj) {
    return new TGet(obj);
};

exports.Put = function(obj) {
    return new TPut(obj);
};

exports.Del = function(obj) {
    return new TDel(obj);
};

exports.Inc = function(obj) {
    return new TInc(obj);
};

exports.Int64 = function(a, b) {
    if(arguments.length < 2)
        return new Int64(a);
    else
        return new Int64(a, b);
};

exports.createClient = function(options) {
    return new TClient(options);
};
