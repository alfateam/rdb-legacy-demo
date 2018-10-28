const rdb = require('rdb');
const resetDemo = require('./db/resetDemo');

const Customer = rdb.table('_customer');

Customer.primaryColumn('cId').guid().as('id');
Customer.column('cName').string().as('name');


const db = rdb('postgres://rdb:rdb@localhost/rdbdemo');

module.exports = async function() {
    try {
        await resetDemo();
        await db.transaction();
        let customer = await Customer.getById('a0000000-0000-0000-0000-000000000000');
        customer.name = 'Ringo';
        customer = await Customer.getById('a0000000-0000-0000-0000-000000000000');
        if (customer.name !== 'Ringo')
            throw new Error('this will not happen');
        await rdb.commit();
        console.log('Waiting for connection pool to teardown....');
    } catch (e) {
        console.log(e.stack);
        rdb.rollback();
    }
}();