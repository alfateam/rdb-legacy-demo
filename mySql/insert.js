let rdb = require('rdb');
let resetDemo = require('./db/resetDemo');

let Customer = rdb.table('_customer');

Customer.primaryColumn('cId').guid().as('id');
Customer.column('cName').string().as('name');

let db = rdb('mysql://rdb:rdb@localhost/rdbDemo?multipleStatements=true');

module.exports = async function() {
    try {
        await resetDemo();
        await db.transaction(async () => {
            let id = 'abcdef00-0000-0000-0000-000000000000'
            let customer = Customer.insert(id)
            customer.name = 'Paul';
            customer = await Customer.getById(id);
            console.log(customer.name)
        });
    } catch (e) {
        console.log(e.stack);
    }
}();