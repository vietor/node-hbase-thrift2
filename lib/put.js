"use strict";

var HBaseTypes = require('../gen-nodejs/hbase_types');

function Put(row) {
    var self = this;

    self.row = row;
    self.columnValues = [];

    self.add = function(family, qualifier, value, timestamp) {
        var buf, data = {
            family: family,
            qualifier: qualifier
        };
        if(value instanceof Buffer)
            data.value = value;
        else
            data.value = value.toString();
        if (timestamp)
            data.timestamp = new Int64(timestamp);
        self.columnValues.push(new HBaseTypes.TColumnValue(data));
    };
}

module.exports = Put;
