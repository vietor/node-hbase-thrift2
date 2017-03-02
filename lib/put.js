"use strict";

var Int64 = require('node-int64');
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
        if (typeof value === "object") {
            if (value.type === "long") {
                data.value = new Int64(value.value);
            } else if (value.type === "integer") {
                buf = new Buffer(4);
                buf.writeInt32BE(value.value, 0);
                data.value = buf;
            } else if (value.type === "float") {
                buf = new Buffer(4);
                buf.writeFloatBE(value.value, 0);
                data.value = buf;
            } else {
                throw new Error('Unsupported type for put value : ' + value.type);
            }
        } else {
            data.value = value.toString();
        }
        if (timestamp)
            data.timestamp = new Int64(timestamp);
        self.columnValues.push(new HBaseTypes.TColumnValue(data));
    };
}

module.exports = Put;
