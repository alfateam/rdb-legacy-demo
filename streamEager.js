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

let db = rdb('postgres://rdb:rdb@localhost/rdbdemo');

module.exports = async function() {
    try {
        await resetDemo();
        let emptyFilter;
        let strategy = {
            lines: {
                orderBy: ['product']
            },
            orderBy: ['orderNo']
        };
        Order.createReadStream(db, emptyFilter, strategy).on('data', printOrder);
    } catch (e) {
        console.log(e.stack);
    }
}();

function printOrder(order) {
    console.log(inspect(order, false, 10));
}