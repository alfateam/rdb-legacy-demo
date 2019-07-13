const rdb = require('rdb');
const resetDemo = require('./db/resetDemo');

const Customer = rdb.table('_customer');

Customer.primaryColumn('cId').guid().as('id');
Customer.column('cName').string().as('name');

const db = rdb('postgres://rdb:rdb@localhost/rdbdemo');

module.exports = function () {
    resetDemo().then(db.transaction).then(getCustomers).then(rdb.commit).then(null, () => {
        console.log(e.stack);
        rdb.rollback;
    });
}();

async function getCustomers() {
    let customers = await Customer.getMany();
    let dtos = await customers.toDto();
    console.log(dtos);
    await rdb.commit();
}
