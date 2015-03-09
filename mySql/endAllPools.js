var rdb = require('rdb');

var dbPg = rdb('postgres://postgres:postgres@localhost/test');
var dbMySql = rdb.mySql('mysql://root@localhost/rdbDemo?multipleStatements=true');

module.exports = connectPg()
    .then(connectMySql)
    .then(rdb.end)
    .then(onOk, onFailed);


function connectPg() {
    return dbPg.transaction()
        .then(rdb.commit)
        .then(null, rdb.rollback);
}

function connectMySql() {
    return dbMySql.transaction()
        .then(rdb.commit)
        .then(null, rdb.rollback);
}

function onOk() {
    console.log('Pools ended.');
}

function onFailed(err) {
    console.log(err.stack);
}
