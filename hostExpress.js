let express = require('express');
let {json} = require('body-parser');

let rdb = require('rdb');

let Order = rdb.table('_order');
Order.primaryColumn('oId').guid().as('id');
Order.column('oOrderNo').string().as('orderNo');

let OrderLine = rdb.table('_orderLine');
OrderLine.primaryColumn('lId').guid().as('id');
OrderLine.column('lOrderId').guid().as('orderId');
OrderLine.column('lProduct').string().as('product');

let line_order_relation = OrderLine.join(Order).by('lOrderId').as('order');
Order.hasMany(line_order_relation).as('lines');

let db = rdb('postgres://rdb:rdb@localhost/rdbdemo');
let port = 8080;

let app = express();

app.disable('x-powered-by')
    .use(json({limit:'100mb'}))
    .use('/orders', db.express(Order))
    app.listen(port, () => console.log(`Example app listening on port ${port}!`));
