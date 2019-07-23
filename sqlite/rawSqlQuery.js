let rdb = require('rdb');
let resetDemo = require('./db/resetDemo');

let db = rdb.sqlite(__dirname + '/db/rdbDemo');

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