let rdb = require('rdb');
let resetDemo = require('./db/resetDemo');
let promise = require('promise/domains');

let Order = rdb.table('_compositeOrder');
let OrderLine = rdb.table('_compositeOrderLine');

Order.primaryColumn('companyId').numeric();
Order.primaryColumn('orderNo').numeric();

OrderLine.primaryColumn('companyId').numeric();
OrderLine.primaryColumn('orderNo').numeric();
OrderLine.primaryColumn('lineNo').numeric();
OrderLine.column('product').string();

let line_order_relation = OrderLine.join(Order).by('companyId', 'orderNo').as('order');
Order.hasMany(line_order_relation).as('lines');

let db = rdb('mysql://rdb:rdb@localhost/rdbDemo?multipleStatements=true');

module.exports = async function() {
    try {
        await resetDemo();
        await db.transaction();
        let start = new Date();
        insertOrders();
        let orders = await Order.getMany(null, { lines: null });
        await traverse(orders);
        await rdb.commit();
        let elapsed = new Date() - start;
        console.info("Execution time: %dms", elapsed);
        console.log('Waiting for connection pool to teardown....');
    } catch (e) {
        console.log(e.stack);
        rdb.rollback();
    }
}();

function insertOrders() {
    for (let i = 0; i < 500; i++) {
        let order = Order.insert(1, i);
        for (let y = 0; y < 20; y++) {
            let line = OrderLine.insert(1, i, y);
        }
    }
}

async function traverse(orders) {
    for (let i = 0; i < orders.length; i++) {
        console.log(orders[i].orderNo);
        let lines  = await orders[i].lines;
        for (let i = 0; i < lines.length; i++) {
            let line = lines[i];
        }
    }
}