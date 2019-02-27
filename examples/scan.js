var util = require('util');
var _ = require('lodash'),
    async = require('async'),
    HBase = require('../');

var config = {
    debug: true,
    hosts: ['192.168.136.9'],
    port: 9090
};

var table = 'test-scan';
var rowPrefix = 'rowkey-';
var hbaseClient = HBase.createClient(config);

function doPut(callback) {
    async.timesSeries(101, function(n, next) {
        var put = HBase.Put(rowPrefix + n);
        put.add('f1', 'n', n);
        put.add('f2', 'n', HBase.Int64(n));
        hbaseClient.put(table, put, function(err) {
            next(err);
        });
    }, function(err) {
        if (err)
            console.log('put error:', err);
        else
            console.log('put is successfully');
        callback(null);
    });
}

function doScan(callback) {
    var scan = HBase.Scan('rowkey-2', 'rowkey-25');
    scan.add('f1');
    scan.add('f2');
    hbaseClient.scan(table, scan, 3, function(err, rows) {
        if (err)
            console.log('scan error:', err);
        else
            console.log('scan result:', util.inspect(rows, false, 100));
        callback();
    });
}

function doScanFilter(callback) {
    var scan = HBase.Scan();
    scan.setFilterString("SingleColumnValueFilter('f1','n',>,'binary:30') AND SingleColumnValueFilter('f1','n',<,'binary:32')");
    hbaseClient.scan(table, scan, 3, function(err, rows) {
        if (err)
            console.log('scan filter error:', err);
        else
            console.log('scan filter result:', util.inspect(rows, false, 100));
        callback();
    });
}

function doScanForEach(callback) {
    var idx = 0;
    var scan = HBase.Scan();
    scan.add('f1');
    scan.add('f2');
    hbaseClient.scanForEach(table, scan, 10, function(rows, next) {
        console.log('scanForEach:', ++idx);
        _.each(rows, function(row) {
            console.log(' row: ' + row.row);
        });
        next(null);
    }, function(err) {
        if (err)
            console.log('scanEach error:', err);
        else
            console.log('scanEach is successfully');
        callback();
    });
}

async.waterfall([
    function(nextcall) {
        doPut(nextcall);
    },
    function(nextcall) {
        doScan(nextcall);
    },
    function(nextcall) {
        doScanFilter(nextcall);
    },
    function(nextcall) {
        doScanForEach(nextcall);
    }
], function() {
    process.exit(1);
});
