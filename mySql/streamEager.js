const rdb = require('rdb');
const resetDemo = require('./db/resetDemo');
const inspect = require('util').inspect;

const Order = rdb.table('_order');
const OrderLine = rdb.table('_orderLine');

Order.primaryColumn('oId').guid().as('id');
Order.column('oOrderNo').string().as('orderNo');

OrderLine.primaryColumn('lId').guid().as('id');
OrderLine.column('lOrderId').guid().as('orderId');
OrderLine.column('lProduct').string().as('product');

const line_order_relation = OrderLine.join(Order).by('lOrderId').as('order');
Order.hasMany(line_order_relation).as('lines');

const db = rdb('mysql://root@localhost/rdbDemo?multipleStatements=true');

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
        await Order.createReadStream(db, emptyFilter, strategy).on('data', printOrder);
        console.log('Waiting for connection pool to teardown....');
    } catch (e) {
        console.log(e.stack);
    }
}();

function printOrder(order) {
    console.log(inspect(order, false, 10));
}