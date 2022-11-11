let rdb = require('rdb');
let resetDemo = require('./db/resetDemo');

let Customer = rdb.table('_customer');
Customer.primaryColumn('id').guid();
Customer.column('balance').numeric();

let db = rdb('postgres://rdb:rdb@localhost/rdbdemo');

module.exports = async function() {
    try {
        await resetDemo();
        await showBalance();
        await updateConcurrently();
        await showBalance();
    } catch (e) {
        console.log(e.stack);
    }
}();

function showBalance() {
    return db.transaction(async () => {
        let customer = await Customer.getById('a0000000-0000-0000-0000-000000000000');
        console.log('Balance: ' + customer.balance);
    });
}

function updateConcurrently() {
    let concurrent1 = db.transaction(async () => {
        await db.lock("12345", runLocked);
    });

    let concurrent2 = db.transaction(async () => {
        await db.lock("12345", runLocked);
    });

    async function runLocked() {
        let customer = await Customer.getById('a0000000-0000-0000-0000-000000000000');
        customer.balance += 100;
    }

    return Promise.all([concurrent1, concurrent2]);
}