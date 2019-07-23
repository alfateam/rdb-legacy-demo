let rdb = require('rdb');
let resetDemo = require('./db/resetDemo');
let poolOptions = {size: 20};

let db = rdb.sqlite(__dirname + '/db/rdbDemo', poolOptions);

module.exports = async function() {
    try {
        await resetDemo();
        await db.transaction(async () => {
            //transaction will commit after this function
        });
    } catch (e) {
        console.log(e.stack);
    }
}();