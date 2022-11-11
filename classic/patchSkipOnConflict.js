let {createPatch} = require('rdb-client');
let rdb = require('rdb');
let resetDemo = require('./db/resetDemo');

let Customer = rdb.table('_customer');

Customer.primaryColumn('id').guid();
Customer.column('name').string();

let db = rdb('postgres://rdb:rdb@localhost/rdbdemo');

module.exports = async function() {
    await resetDemo();
    await db.transaction(async () => {
        let filter = Customer.id.eq('a0000000-0000-0000-0000-000000000000');
        let original = await Customer.getManyDto(filter);
        let customers = JSON.parse(JSON.stringify(original));
        customers[0].name = 'John';

        let changedCustomer = await Customer.getById('a0000000-0000-0000-0000-000000000000');
        changedCustomer.name = 'Ringo';


        let patch = createPatch(original, customers);
        await Customer.patch(patch, {concurrency: {name: 'skipOnConflict'}});

        customers = await Customer.getManyDto(filter);
        console.log(customers[0]) //unchanged
    });
}();