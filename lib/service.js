"use strict";

var TGet = require('./get'),
    TPut = require('./put'),
    TInc = require('./inc'),
    TDel = require('./del'),
    TScan = require('./scan'),
    TClient = require('./client'),
    Int64 = require('thrift').Int64;

exports.Get = function(rowKey) {
    return new TGet(rowKey);
};

exports.Put = function(rowKey) {
    return new TPut(rowKey);
};

exports.Del = function(rowKey) {
    return new TDel(rowKey);
};

exports.Inc = function(rowKey) {
    return new TInc(rowKey);
};

exports.Scan = function(startRow, stopRow) {
    return new TScan(startRow, stopRow);
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
