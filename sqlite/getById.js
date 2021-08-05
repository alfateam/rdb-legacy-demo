let rdb = require('rdb');
let resetDemo = require('./db/resetDemo');
let Customer = rdb.table('_customer');

Customer.primaryColumn('id').guid();
Customer.column('name').string();
Customer.column('balance').numeric();
Customer.column('regDate').date().as('registeredDate');
Customer.column('isActive').boolean();
Customer.column('picture').binary();
Customer.column('document').json();

let db = rdb.sqlite(__dirname + '/db/rdbDemo');

module.exports = async function() {
    try {
        await resetDemo();
        await db.transaction(async () => {
            let customer = await Customer.getById('a0000000-0000-0000-0000-000000000000');
            console.log(await customer.toDto());
        });
    } catch (e) {
        console.log(e.stack);
    }
}();