const rdb = require('rdb');
const resetDemo = require('./db/resetDemo');

const db = rdb('postgres://rdb:rdb@localhost/rdbdemo');

module.exports = async function() {
    try {
        await resetDemo();
        await db.transaction(async () => {
            let result = await rdb.query('SELECT DISTINCT oCustomerId AS "customerId" FROM _order');
            console.log(result);
        });
    } catch (e) {
        console.log(e.stack);
    }
}();