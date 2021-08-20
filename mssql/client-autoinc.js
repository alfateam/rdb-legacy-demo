let rdbClient = require('rdb-client');
let rdb = require('rdb');
let resetDemo = require('./db/resetDemo');

let OrderDef = rdb.table('_orderauto');
OrderDef.primaryColumn('id').numeric();
OrderDef.column('orderNo').string();

let OrderLineDef = rdb.table('_orderLineauto');
OrderLineDef.primaryColumn('id').numeric();
OrderLineDef.column('orderId').numeric();
OrderLineDef.column('product').string();

let line_order_relation = OrderLineDef.join(OrderDef).by('orderId').as('order');
OrderDef.hasMany(line_order_relation).as('lines');

let db = rdb.mssql('server=.;Database=rdbDemo;Trusted_Connection=Yes;Driver={ODBC Driver 17 for SQL Server}');

let Order = rdbClient.table(OrderDef, {db});

run();

async function run() {
    await resetDemo();
    let rows = Order.proxify([]);
    rows.push({ orderNo: '112333'})
    rows.push({ orderNo: '11233', lines: [{product: 'the product'}]})
    await rows.save();

    rows.push({ orderNo: '7777', lines: [{product: 'the product2'}]})
    rows.push({ orderNo: '55', lines: [{product: 'the product3'}]})
    rows[0].orderNo = '7766';
    await rows.save();
    console.dir(rows, {depth: 10})
}