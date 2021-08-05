let rdb = require('rdb');
let resetDemo = require('./db/resetDemo');

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
        await db.transaction(async () => {
            let companyId = 1;
            let orderId = 1001;
            let order = await Order.getById(companyId, orderId);
            console.log(await order.toDto());
        });
    } catch (e) {
        console.log(e.stack);
    }
}();