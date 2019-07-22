let rdb = require('rdb');
let resetDemo = require('./db/resetDemo');

let db = rdb('postgres://rdb:rdb@localhost/rdbdemo');

module.exports = async function() {
    try {
        await resetDemo();
        await db.transaction(async () => {
            //transaction will commit after this function
        });
        await db.end();
        console.log('Pool ended.');
    } catch (e) {
        console.log(e.stack);
    }
}();