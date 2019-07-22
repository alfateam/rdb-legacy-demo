let rdb = require('rdb');
let resetDemo = require('./db/resetDemo');

let Customer = rdb.table('_customer');

Customer.primaryColumn('cId').guid().as('id');
Customer.column('cName').string().as('name');


let db = rdb('postgres://rdb:rdb@localhost/rdbdemo');

module.exports = async function() {
    try {
        await resetDemo();
        await db.transaction(async () => {
            let customer = await Customer.getById('a0000000-0000-0000-0000-000000000000');
            customer.name = 'Ringo';
            customer = await Customer.getById('a0000000-0000-0000-0000-000000000000');
            console.log(customer.name)
        });
    } catch (e) {
        console.log(e.stack);
    }
}();