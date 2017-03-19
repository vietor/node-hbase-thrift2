"use strict";

var _ = require('lodash');
var async = require('async');
var thrift = require('thrift');
var HBase = require('../gen-nodejs/THBaseService'),
    HBaseTypes = require('../gen-nodejs/hbase_types');

function RetryClient(options) {
    if (!options.hosts || options.hosts.length < 1 || !options.port) {
        throw new Error('hosts or port is none');
    }

    var self = this;
    var debug = options.debug || false;

    self._hostid = 0;
    self._reqid = 0;
    self._reqs = {};
    self._inited = false;

    self.client = null;
    self.connection = null;

    self.retry_seqid = 0;
    self.retry_count = 0;
    self.retry_limit = options.retry_count || 3;

    self.cleanOldClient = function(err) {
        if (self.connection) {
            self.connection.end();
            self.connection = null;
        }
        if (self.client) {
            self.client._reqs = {};
            self.client = null;
        }

        self.retry_count += 1;
        if (self.retry_count >= self.retry_limit) {
            self.retry_count = 0;
            _.each(_.keys(self._reqs), function(seqid) {
                self._reqs[seqid].callback(err);
            });
        }
    };

    self.onNetworkReady = function() {
        if(debug)
            console.info('HBase client connected');
        self.retry_count = 0;
        self.client = thrift.createClient(HBase, self.connection);
        _.each(_.keys(self._reqs), function(seqid) {
            var req = self._reqs[seqid];
            req.executor(self.client, req.callback);
        });
    };

    self.onNetworkClose = function(retry_seqid) {
        if (retry_seqid != self.retry_seqid) {
            return;
        }
        var err = new Error('remote socket close');
        if(debug)
            console.error('HBase client', err);
        self.cleanOldClient(err);
        self.retryNetworkConnect();
    };

    self.onNetworkError = function(retry_seqid, err) {
        if (retry_seqid != self.retry_seqid) {
            return;
        }
        if(debug)
            console.error('HBase client', err);
        self.cleanOldClient(err);
        self.retryNetworkConnect();
    };

    self.retryNetworkConnect = function() {
        self._hostid = (self._hostid + 1) % options.hosts.length;
        var connection = thrift.createConnection(options.hosts[self._hostid], options.port, {
            transport: thrift.TBufferedTransport,
            protocol: thrift.TBinaryProtocol,
            connect_timeout: options.timeout || 0
        });

        self.retry_seqid += 1;
        self.connection = connection;
        self.connection.on('connect', self.onNetworkReady.bind(self));
        self.connection.on('error', self.onNetworkError.bind(self, self.retry_seqid));
        self.connection.on('close', self.onNetworkClose.bind(self, self.retry_seqid));
    };

    self.submit = function(executor, callback) {
        var reqid = self._reqid++;
        var done = function(err, data) {
            delete self._reqs[reqid];
            callback(err, data);
        };
        self._reqs[reqid] = {
            executor: executor,
            callback: done
        };
        if (self.client)
            executor(self.client, done);
        else if (!self._inited) {
            self._inited = true;
            self.retryNetworkConnect();
        }
    };
}

function Client(options) {
    var debug = options.debug || false;
    var retryClient = new RetryClient(options);

    function parseRow(data) {
        var parsed = {
            row: null,
            columnValues: []
        };
        if (data.row) {
            try {
                parsed.row = data.row.toString();
                _.each(data.columnValues, function(row) {
                    parsed.columnValues.push({
                        family: row.family.toString(),
                        qualifier: row.qualifier.toString(),
                        value: row.value,
                        timestamp: parseInt((row.timestamp))
                    });
                });
            } catch(err) {
                if(debug)
                    console.error('HBase parse', err);
            }
        }
        return parsed;
    }

    this.get = function(table, obj, callback) {
        var data = new HBaseTypes.TGet(obj);
        retryClient.submit(function(pureClient, done) {
            pureClient.get(table, data, done);
        }, function(err, data) {
            if (err)
                callback(err);
            else
                callback(null, parseRow(data));
        });
    };

    this.put = function(table, obj, callback) {
        var data = new HBaseTypes.TPut(obj);
        retryClient.submit(function(pureClient, done) {
            pureClient.put(table, data, done);
        }, callback);
    };

    this.del = function(table, obj, callback) {
        var data = new HBaseTypes.TDelete(obj);
        retryClient.submit(function(pureClient, done) {
            pureClient.deleteSingle(table, data, done);
        }, callback);
    };

    this.inc = function(table, obj, callback) {
        var data = new HBaseTypes.TIncrement(obj);
        retryClient.submit(function(pureClient, done) {
            pureClient.increment(table, data, done);
        }, function(err, data) {
            if (err)
                callback(err);
            else
                callback(null, parseRow(data));
        });
    };

    this.scan = function(table, obj, numRows,callback) {
        var data = new HBaseTypes.TScan(obj);
        retryClient.submit(function(pureClient, done) {
            pureClient.getScannerResults(table, data, numRows, done);
        }, function(err, data) {
            if (err)
                callback(err);
            else
                callback(null, _.map(data, parseRow));
        });
    };

    this.scanEach = function(table, obj, batchSize, iteratee, callback) {
        var data = new HBaseTypes.TScan(obj);
        retryClient.submit(function(pureClient, done) {
            pureClient.openScanner(table, data, function(err, scannerId) {
                if(err)
                    done(err);
                else {
                    var stopped = false;
                    async.until(function() {
                        return stopped;
                    }, function(next){
                        pureClient.getScannerRows(scannerId, batchSize, function (err, data) {
                            if(err)
                                next(err);
                            else {
                                stopped = data.length < batchSize;
                                iteratee(_.map(data, parseRow), next);
                            }
                        });
                    }, function(err) {
                        pureClient.closeScanner(scannerId, function() {
                            done(err);
                        });
                    });
                }
            });
        }, callback);
    };
}

module.exports = Client;
