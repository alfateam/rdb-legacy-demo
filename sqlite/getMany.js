let rdb = require('rdb');
let resetDemo = require('./db/resetDemo');

let Customer = rdb.table('_customer');

Customer.primaryColumn('id').guid();
Customer.column('name').string();

let db = rdb.sqlite(__dirname + '/db/rdbDemo');

module.exports = async function() {
    try {
        await resetDemo();
        await db.transaction(async () => {
            let customers = await Customer.getMany();
            let dtos = await customers.toDto();
            console.log(dtos);
        });
    } catch (e) {
        console.log(e.stack);
    }
}();
