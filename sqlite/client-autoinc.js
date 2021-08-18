let rdbClient = require('rdb-client');
let rdb = require('rdb');
// const resetDemo = require('./db/resetDemo');

rdb.log(console.log);
let OrderDef = rdb.table('_orderauto');
OrderDef.primaryColumn('id').numeric();
OrderDef.column('orderNo').string();

let OrderLineDef = rdb.table('_orderLineauto');
OrderLineDef.primaryColumn('id').numeric();
OrderLineDef.column('orderId').numeric();
OrderLineDef.column('product').string();

let line_order_relation = OrderLineDef.join(OrderDef).by('orderId').as('order');
OrderDef.hasMany(line_order_relation).as('lines');

let db = rdb.sqlite(__dirname + '/db/rdbDemo');

let Order = rdbClient.table(OrderDef, {db});

run();

async function run() {
    let rows = Order.proxify([]);
    // rows.push({ orderNo: '112333'})
    rows.push({ orderNo: '11233', lines: [{product: 'the product'}]})
    await rows.save();
    // rows.push({ orderNo: '7777', lines: [{product: 'the product2'}]})
    // rows.push({ orderNo: '55', lines: [{product: 'the product3'}]})
    rows[0].orderNo = '7766';
    // rows.splice(0,0,{ orderNo: '66', lines: [{product: 'the product4'}]})
    await rows.save();
    console.dir(rows, {depth: 10})
}