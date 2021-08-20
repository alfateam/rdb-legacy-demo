let rdb = require('rdb');
let resetDemo = require('./db/resetDemo');
let inspect = require('util').inspect;

let Order = rdb.table('_order');
let OrderLine = rdb.table('_orderLine');

Order.primaryColumn('id').guid();
Order.column('orderNo').string();

OrderLine.primaryColumn('id').guid();
OrderLine.column('orderId').guid();
OrderLine.column('product').string();

let line_order_relation = OrderLine.join(Order).by('orderId').as('order');
Order.hasMany(line_order_relation).as('lines');

rdb.log(console.log)
let db = rdb.mssql('server=.;Database=rdbDemo;Trusted_Connection=Yes;Driver={ODBC Driver 17 for SQL Server}');

module.exports = async function() {
    try {
        await resetDemo();
        await db.transaction(async () => {
            let order = await Order.getById('b0000000-b000-0000-0000-000000000000', {lines: true});
            console.log(order);
        });
    } catch (e) {
        console.log(e.stack);
    }
}();