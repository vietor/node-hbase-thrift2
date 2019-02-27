"use strict";

var Int64 = require('thrift').Int64;
var HBaseTypes = require('../gen-nodejs/hbase_types');

function Del(row) {
    var self = this;

    self.row = row;
    self.columns = [];

    self.add = function(family, qualifier, timestamp) {
        var data = {
            family: family
        };
        if (qualifier)
            data.qualifier = qualifier;
        if (timestamp)
            data.timestamp = new Int64(timestamp);
        self.columns.push(new HBaseTypes.TColumn(data));
    };
}

module.exports = Del;
