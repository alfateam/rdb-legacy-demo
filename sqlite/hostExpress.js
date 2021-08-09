let express = require('express');
let {json} = require('body-parser');

let rdb = require('rdb');

let Order = rdb.table('_order');
Order.primaryColumn('id').guid();
Order.column('orderNo').string();

let OrderLine = rdb.table('_orderLine');
OrderLine.primaryColumn('id').guid();
OrderLine.column('orderId').guid();
OrderLine.column('product').string();

let line_order_relation = OrderLine.join(Order).by('orderId').as('order');
Order.hasMany(line_order_relation).as('lines');

let db = rdb.sqlite(__dirname + '/db/rdbDemo');


let port = 8080;
run();

async function run() {
    await require('../db/resetDemo');
    let app = express();

    app.disable('x-powered-by')
        .use(json({limit:'10mb'}))
        .use('/order', rdb.express({table: Order, db}));
        app.listen(port, () => console.log(`Example app listening on port ${port}!`));

}
