const rdb = require('rdb');
const resetDemo = require('./db/resetDemo');

const Customer = rdb.table('_customer');

Customer.primaryColumn('cId').guid(); //property name will also be cId
Customer.column('cName').string(); //property name will also be cName

const db = rdb('mysql://root@localhost/rdbDemo?multipleStatements=true');

module.exports = async function() {
    try {
        await resetDemo();
        await db.transaction();
        const customer = Customer.insert('abcdef01-0000-0000-0000-000000000000')
        customer.cName = 'Paul';
        console.log(await customer.toDto());
        await rdb.commit();
        console.log('Waiting for connection pool to teardown....');
    } catch (e) {
        console.log(e.stack);
        rdb.rollback();
    }
}();