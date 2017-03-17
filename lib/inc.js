"use strict";

var HBaseTypes = require('../gen-nodejs/hbase_types');

function Inc(row) {
    var self = this;

    self.row = row;
    self.columns = [];

    self.add = function(family, qualifier, amount) {
        var data = {
            family: family,
            qualifier: qualifier
        };
        if (amount)
            data.amount = amount;
        self.columns.push(new HBaseTypes.TColumnIncrement(data));
    };
}

module.exports = Inc;
