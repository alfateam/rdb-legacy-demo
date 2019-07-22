let rdb = require('rdb');

let dbPg = rdb('postgres://rdb:rdb@localhost/rdbdemo');
let dbMySql = rdb.mySql('mysql://root@localhost/rdbDemo?multipleStatements=true');

module.exports = async function() {
    try {
        await connectPg();
        await connectMySql();
        await rdb.end();
        console.log('Pools ended.');
    } catch (e) {
        console.log(e.stack);
    }
}();

async function connectPg() {
    try {
        await dbPg.transaction();
        await rdb.commit();
    } catch (e) {
        console.log(e.stack);
        rdb.rollback();
    }
};

async function connectMySql() {
    try {
        await dbMySql.transaction();
        await rdb.commit();
    } catch (e) {
        console.log(e.stack);
        rdb.rollback();
    }
};
