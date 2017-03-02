var async = require('async'),
    HBase = require('../');

var config = {
    hosts: ['master'],
    port: 9090
};

var row = 'row1';
var table = 'test';
var hbaseClient = HBase.createClient(config);

function doPut(callback) {
    var put = HBase.Put(row);
    put.add('f1', 'q1', '1');
    put.add('f1', 'q2', '1', 1);
    put.add('f1', 'q2', '2', 2);
    put.add('f2', 'q1', '1');
    put.add('f3', 'q1', '1');
    put.add('f3', 'q2', '2');
    put.add('f3', 'q3', '3', 1);
    put.add('f3', 'q3', '4', 2);

    hbaseClient.put(table, put, function(err) {
        if (err)
            console.log('put error:', err);
        else
            console.log('put is successfully');
        callback();
    });
}

function doInc(callback) {
    var inc = HBase.Inc(row);
    inc.add('f2', 'q2');

    hbaseClient.inc(table, inc, function(err, data) {
        if (err)
            console.log('inc error:', err);
        else
            console.log('inc data:', data);
        callback();
    });
}

function doGet(callback) {
    var get = HBase.Get(row);

    hbaseClient.get(table, get, function(err, data) {
        if (err)
            console.log('get error:', err);
        else
            console.log('get data:', data);
        callback();
    });
}

function doDel(callback) {
    var del = HBase.Del(row);

    hbaseClient.get(table, del, function(err, data) {
        if (err)
            console.log('del error:', err);
        else
            console.log('del is successfully');
        callback();
    });
}

async.waterfall([
    function(nextcall) {
        doPut(nextcall);
    },
    function(nextcall) {
        doInc(nextcall);
    },
    function(nextcall) {
        doGet(nextcall);
    },
    function(nextcall) {
        doDel(nextcall);
    }
], function() {
    process.exit(1);
});
