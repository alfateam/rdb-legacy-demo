let {createPatch} = require('rdb-client');
let rdb = require('rdb');
let resetDemo = require('./db/resetDemo');
let inspect = require('util').inspect;
let Customer = rdb.table('_customer');

Customer.primaryColumn('id').guid();
Customer.column('name').string();
Customer.column('balance').numeric();
Customer.column('regDate').date().as('registeredDate');
Customer.column('isActive').boolean();
// Customer.column('picture').binary();
Customer.column('document').json();

let db = rdb('postgres://rdb:rdb@localhost/rdbdemo');

module.exports = async function() {
    try {
        await resetDemo();
        await db.transaction(async () => {
            let row = await Customer.getById('a0000000-0000-0000-0000-000000000000');
            let originalDto = await row.toDto();
            let customer = JSON.parse(JSON.stringify(originalDto));
            customer.name = 'Ringo';
            customer.balance = 32;
            customer.registeredDate = undefined;
            customer.document[2].bar = 'bar changed';

            let patch = createPatch(originalDto, customer);
            await row.patch(patch);
            console.log(inspect(await row.toDto(), false, 10));
        });
    } catch (e) {
        console.log(e.stack);
    }
}();