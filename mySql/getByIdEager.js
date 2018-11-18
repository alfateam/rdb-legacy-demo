const rdb = require('rdb');
const resetDemo = require('./db/resetDemo');
const inspect = require('util').inspect;

const Customer = rdb.table('_customer');
const Order = rdb.table('_order');

Customer.primaryColumn('cId').guid().as('id');
Customer.column('cName').string().as('name');

Order.primaryColumn('oId').guid().as('id');
Order.column('oOrderNo').string().as('orderNo');
Order.column('oCustomerId').guid().as('customerId');
Order.join(Customer).by('oCustomerId').as('customer');

const db = rdb('mysql://root@localhost/rdbDemo?multipleStatements=true');

module.exports = async function() {
    try {
        await resetDemo();
        await db.transaction();
        let fetchingStrategy = { customer: null }; //alternatively: {customer : {}} 
        let order = await Order.getById('a0000000-a000-0000-0000-000000000000', fetchingStrategy);
        console.log(await order.toDto());
        let customer = await order.customer;
        console.log(await customer.toDto());
        await rdb.commit();
        console.log('Waiting for connection pool to teardown....');
    } catch (e) {
        console.log(e.stack);
        rdb.rollback();
    }
}();