"use strict";

var Int64 = require('thrift').Int64;
var HBaseTypes = require('../gen-nodejs/hbase_types');

function Get(row) {
    var self = this;

    self.row = row;
    self.columns = [];
    self.maxVersions = 1;

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

    self.setMaxVersions = function(maxVersions) {
        self.maxVersions = maxVersions;
    };
}

module.exports = Get;
