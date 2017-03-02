"use strict";

var TGet = require('./get'),
    TPut = require('./put'),
    TInc = require('./Inc'),
    TDel = require('./del'),
    TClient = require('./client');

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

exports.createClient = function(options) {
    return new TClient(options);
};
