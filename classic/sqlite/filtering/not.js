let rdb = require('rdb');
let resetDemo = require('../db/resetDemo');

let Customer = rdb.table('_customer');

Customer.primaryColumn('id').guid();
Customer.column('name').string();

let db = rdb.sqlite(__dirname + '/../db/rdbDemo');

module.exports = async function() {
    try {
        await resetDemo();
        await db.transaction(async () => {
            let filter = Customer.name.equal('John').not();
            let customers = await Customer.getMany(filter);
            console.log(await customers.toDto());
        });
    } catch (e) {
        console.log(e.stack);
    }
}();