let rdb = require('rdb');
let resetDemo = require('./db/resetDemo');

let Customer = rdb.table('_customer');
let Order = rdb.table('_order');

Customer.primaryColumn('cId').guid().as('id');
Customer.column('cName').string().as('name');

Order.primaryColumn('oId').guid().as('id');
Order.column('oOrderNo').string().as('orderNo');
Order.column('oCustomerId').guid().as('customerId');

Order.join(Customer).by('oCustomerId').as('customer');

let db = rdb('mysql://root@localhost/rdbDemo?multipleStatements=true');

module.exports = async function() {
    try {
        await resetDemo();
        await db.transaction();
        let order = await Order.getById('b0000000-b000-0000-0000-000000000000');
        let yokoId = '12345678-0000-0000-0000-000000000000';
        order.customerId = yokoId;
        let customer = await order.customer;
        if (customer.name !== 'Yoko')
            throw new Error('this will not happen');
        await rdb.commit();
        console.log('Waiting for connection pool to teardown....');
    } catch (e) {
        console.log(e.stack);
        rdb.rollback();
    }
}();