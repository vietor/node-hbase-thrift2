node-hbase-thrift2
===

[![NPM Version][npm-image]][npm-url]
[![NPM Downloads][downloads-image]][downloads-url]

Yet another NodeJS HBase thrift2 client. Reinforcement the Reconnect support.

# Installation

```sh
$ npm install --save node-hbase-thrift2
```

# Usage

## 1. Create client

```javascript
var HBase = require('node-hbase-thrift2')

var config = {
    hosts: ['host1','host2'],
    port: 9090,
    timeout:1000
};

var hbaseClient = HBase.createClient(config);
```

## 2. Get a row data

```javascript
var get = HBase.Get('rowkey');
get.add('family'); // or
get.add('family', 'qualifier'); // or
get.add('family', 'qualifier', 1); // has timestamp
hbaseClient.get('table', get, function(err,data){
    if(err)
        console.log('error:', err);
    else
        console.log('get:', data);
});
```

```sh
get: {
    row: 'rowkey',
    columnValues: [
        {
            family: 'family',
            qualifier: 'qualifier',
            value: <Buffer 31>,
            timestamp: 1488469442863
        }
    ]
}
```

> HBase.Int64()
>> create [node-int64](https://github.com/broofa/node-int64/) instance

## 3. Put or Update columns value in a row

```javascript
var put = HBase.Put('rowkey');
put.add('family', 'qualifier', 'value'); // or
put.add('family', 'qualifier', 'value', Date.now()); // has timestamp
put.add('family', 'qualifier', HBase.Int64(65535)); // direct number buffer
hbaseClient.put('table', put, function(err){
    if(err)
        console.log('error:', err);
    else
        console.log('put is successfully');
});
```

## 4. Increment columns value in a row

```javascript
var inc = HBase.Inc('rowkey');
inc.add('family', 'qualifier');
hbaseClient.inc('table', inc, function(err, data){
    if(err)
        console.log('error:', err);
    else
        console.log('inc:', data);
});
```

```sh
inc: {
    row: 'rowkey',
    columnValues: [
        {
            family: 'family',
            qualifier: 'qualifier',
            value: <Buffer 00 00 00 00 00 00 00 01>,
            timestamp: 1488469442863
        }
    ]
}
```

## 5. Delete some columns value or a row

```javascript
var del = HBase.Del('rowkey');
del.add('family'); // or
del.add('family', 'qualifier'); // or
del.add('family', 'qualifier', 1); // has timestamp
hbaseClient.del('table', del, function(err){
    if(err)
        console.log('error:', err);
    else
        console.log('del is successfully');
});
```

# License

[ISC](LICENSE)

[npm-image]: https://img.shields.io/npm/v/node-hbase-thrift2.svg
[npm-url]: https://npmjs.org/package/node-hbase-thrift2
[downloads-image]: https://img.shields.io/npm/dm/node-hbase-thrift2.svg
[downloads-url]: https://npmjs.org/package/node-hbase-thrift2
