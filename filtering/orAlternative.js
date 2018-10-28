const rdb = require('rdb');
const resetDemo = require('../db/resetDemo');

const Customer = rdb.table('_customer');

Customer.primaryColumn('cId').guid().as('id');
Customer.column('cName').string().as('name');

const db = rdb('postgres://rdb:rdb@localhost/rdbdemo');

module.exports = async function() {
    try {
        await resetDemo();
        await db.transaction();
        let john = Customer.name.equal('John');
        let yoko = Customer.name.equal('Yoko');
        let filter = rdb.filter.or(john).or(yoko);
        //alternatively rdb.filter.and(john).or(yoko);
        let customers = await Customer.getMany(filter);
        console.log(await customers.toDto());
        await rdb.commit();
        console.log('Waiting for connection pool to teardown....');
    } catch (e) {
        console.log(e.stack);
        rdb.rollback();
    }
}();