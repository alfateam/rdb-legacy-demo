const rdb = require('rdb'),
    resetDemo = require('./db/resetDemo');

const Customer = rdb.table('_customer');

Customer.primaryColumn('cId').guid().as('id');
Customer.column('cName').string().as('name');

const db = rdb('postgres://rdb:rdb@localhost/rdbdemo');

module.exports = async function() {
    try {
        await resetDemo();
        await db.transaction();
        const id = 'abcdef00-0000-0000-0000-000000000000'
        let customer = Customer.insert(id)
        customer.name = 'Paul';
        customer = await Customer.getById(id);
        if (customer.name !== 'Paul')
            throw new Error('this will not happen');
        await rdb.commit();
        console.log('Waiting for connection pool to teardown....');
    } catch (e) {
        console.log(e.stack);
        rdb.rollback();
    }
}();