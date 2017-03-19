var async = require('async'),
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
    var scan = HBase.Scan();
    scan.add('f1');
    scan.add('f2');
    scan.setStartRow('rowkey-2');
    scan.setStopRow('rowkey-25');
    hbaseClient.scan(table, scan, 10, function(err, rows) {
        if (err)
            console.log('scan error:', err);
        else
            console.log('scan result:', rows.length);
        callback();
    });
}

function doScanEach(callback) {
    var idx = 0;
    var scan = HBase.Scan();
    scan.add('f1');
    scan.add('f2');
    hbaseClient.scanEach(table, scan, 10, function(rows, next) {
        console.log('scanEach:', ++idx, rows.length);
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
        doScanEach(nextcall);
    }
], function() {
    process.exit(1);
});
