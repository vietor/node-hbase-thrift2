"use strict";

var HBaseTypes = require('../gen-nodejs/hbase_types');

function Inc(row) {
    var self = this;

    self.row = row;
    self.columns = [];

    self.add = function(family, qualifier) {
        var data = {
            family: family
        };
        if (qualifier)
            data.qualifier = qualifier;
        self.columns.push(new HBaseTypes.TColumn(data));
    };
}

module.exports = Inc;
