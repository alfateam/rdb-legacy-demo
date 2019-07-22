let rdb = require('rdb');
let resetDemo = require('./db/resetDemo');

let db = rdb('postgres://rdb:rdb@localhost/rdbdemo');
//alternatively: let db = rdb.pg('postgres://postgres:postgres@localhost/test');

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