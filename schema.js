const rdb = require('rdb');
const resetDemo = require('./db/resetDemo');

const db = rdb('postgres://rdb:rdb@localhost/rdbdemo');
//alternatively: var db = rdb.pg('postgres://postgres:postgres@localhost/test');

module.exports = async function() {
    try {
        await resetDemo();
        await db.transaction();
        await db.transaction({schema: ['mySchema', 'otherSchema']}, async () => {
            //or use string for single schema );
            //transaction will commit after this function
        });
    } catch (e) {
        console.log(e.stack);
    }
}();