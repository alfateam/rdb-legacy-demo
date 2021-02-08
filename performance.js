let rdb = require('rdb');
let resetDemo = require('./db/resetDemo');
let promise = require('promise/domains');

let Order = rdb.table('_compositeOrder');
let OrderLine = rdb.table('_compositeOrderLine');

Order.primaryColumn('oCompanyId').numeric().as('companyId');
Order.primaryColumn('oOrderNo').numeric().as('orderNo');

OrderLine.primaryColumn('lCompanyId').numeric().as('companyId');
OrderLine.primaryColumn('lOrderNo').numeric().as('orderNo');
OrderLine.primaryColumn('lLineNo').numeric().as('lineNo');
OrderLine.column('lProduct').string().as('product');

let line_order_relation = OrderLine.join(Order).by('lCompanyId', 'lOrderNo').as('order');
Order.hasMany(line_order_relation).as('lines');

let db = rdb('postgres://rdb:rdb@localhost/rdbdemo');

module.exports = async function() {
    await resetDemo();
    let start = new Date();
    try {
        await db.transaction(async() =>{
            insertOrders();
            let orders = await Order.getMany(null, { lines: null });
            await traverse(orders);
        } );
    } catch (e) {
        console.log(e.stack);
        rdb.rollback();
    }
    let elapsed = new Date() - start;
    console.info("Execution time: %dms", elapsed);
    console.log('Waiting for connection pool to teardown....');
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