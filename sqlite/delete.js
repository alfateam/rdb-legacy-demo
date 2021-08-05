let rdb = require('rdb');
let resetDemo = require('./db/resetDemo');

let Customer = rdb.table('_customer');

Customer.primaryColumn('id').guid();
Customer.column('name').string();
Customer.column('balance').numeric();
Customer.column('regDate').date().as('registeredDate');
Customer.column('isActive').boolean();
Customer.column('picture').binary();

let db = rdb.sqlite(__dirname + '/db/rdbDemo');

module.exports = async function() {
    try {
        await resetDemo();
        await db.transaction(async () => {
            let customer = await Customer.getById('87654321-0000-0000-0000-000000000000');
            await customer.delete();
        });
    } catch (e) {
        console.log(e.stack);
    }
}();