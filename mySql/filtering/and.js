let rdb = require('rdb');
let resetDemo = require('../db/resetDemo');

let Customer = rdb.table('_customer');

Customer.primaryColumn('cId').guid().as('id');
Customer.column('cIsActive').boolean().as('isActive');
Customer.column('cBalance').numeric().as('balance');
Customer.column('cName').string().as('name');

let db = rdb('mysql://rdb:rdb@localhost/rdbDemo?multipleStatements=true');

module.exports = async function() {
    try {
        await resetDemo();
        await db.transaction(async () => {
            let isActive = Customer.isActive.equal(true);
            let highBalance = Customer.balance.greaterThan(8000);
            let filter = isActive.and(highBalance);
            let customers = await Customer.getMany(filter);
            console.log(await customers.toDto());
        });
    } catch (e) {
        console.log(e.stack);
    }
}();