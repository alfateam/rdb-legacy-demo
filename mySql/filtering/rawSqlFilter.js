const inspect = require('util').inspect;
const rdb = require('rdb');
const resetDemo = require('../db/resetDemo');

const Order = rdb.table('_order');
Order.primaryColumn('oId').guid().as('id');
Order.column('oOrderNo').string().as('orderNo');
Order.column('oCustomerId').guid().as('customerId');

const Customer = rdb.table('_customer');
Customer.primaryColumn('cid').guid().as('id');
Customer.column('cName').string().as('name');
Customer.column('cBalance').string().as('balance');
Customer.column('cIsActive').boolean().as('isActive');

const orderCustomerJoin = Order.join(Customer).by('oCustomerId').as('customer');
Customer.hasMany(orderCustomerJoin).as('orders');

const db = rdb('mysql://root@localhost/rdbDemo?multipleStatements=true');

module.exports = async function() {
    try {
        await resetDemo();
        await db.transaction();
        let filter = {
            sql: 'exists (select 1 from _customer where _customer.cId = oCustomerId and _customer.cBalance > 3000 and _customer.cName LIKE ?)',
            parameters: ['%o%']
        };
        let orders = await Order.getMany(filter);
        let strategy = { customer: null }
        console.log(await orders.toDto(strategy));
        await rdb.commit();
        console.log('Waiting for connection pool to teardown....');
    } catch (e) {
        console.log(e.stack);
        rdb.rollback();
    }
}();