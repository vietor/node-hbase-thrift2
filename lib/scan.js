"use strict";

var Int64 = require('node-int64');
var HBaseTypes = require('../gen-nodejs/hbase_types');

function Scan(startRow, stopRow) {
    var self = this;

    self.columns = [];
    self.maxVersions = 1;

    if(startRow)
        self.startRow = startRow;
    if(stopRow)
        self.stopRow = stopRow;

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

module.exports = Scan;
