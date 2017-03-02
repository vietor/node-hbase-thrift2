node-hbase-thrift2
===

[![NPM Version][npm-image]][npm-url]
[![NPM Downloads][downloads-image]][downloads-url]

Yet another HBase thrift2 client.

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

## 3. Put or Update columns value in a row

```javascript
var put = HBase.Put('rowkey');
put.add('family', 'qualifier', 'value'); // or
put.add('family', 'qualifier', 'value', Date.now()); // has timestamp
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
