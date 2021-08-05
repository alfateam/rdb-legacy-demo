let inspect = require('util').inspect;
let rdb = require('rdb');
let resetDemo = require('./db/resetDemo');

let Order = rdb.table('_order');
let OrderLine = rdb.table('_orderLine');

Order.primaryColumn('id').guid();
Order.column('orderNo').string();

OrderLine.primaryColumn('id').guid();
OrderLine.column('orderId').guid();
OrderLine.column('product').string();

let line_order_relation = OrderLine.join(Order).by('orderId').as('order');
Order.hasMany(line_order_relation).as('lines');

let db = rdb.sqlite(__dirname + '/db/rdbDemo');

module.exports = async function () {
    try {
        await resetDemo();
        await db.transaction(async () => {
            let emptyFilter;
            let strategy = {
                lines: null
            };
            let orders = await Order.getMany(emptyFilter, strategy);
            let dtos = await orders.toDto();
            console.log(inspect(dtos, false, 10));
        });
    } catch (e) {
        console.log(e.stack);
    }
}();