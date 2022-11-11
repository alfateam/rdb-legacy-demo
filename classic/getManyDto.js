let rdb = require('rdb'),
    resetDemo = require('./db/resetDemo');

let Customer = rdb.table('_customer');

Customer.primaryColumn('id').guid();
Customer.column('name').string();

let db = rdb('postgres://rdb:rdb@localhost/rdbdemo');

module.exports = async function() {
    try {
        await resetDemo();
        await db.transaction(async () => {
            console.log(await Customer.getManyDto());
        });
    } catch (e) {
        console.log(e.stack);
    }
}();