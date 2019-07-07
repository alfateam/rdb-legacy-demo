var rdb = require('rdb');
var resetDemo = require('./db/resetDemo');
var promise = require('promise/domains');

var Customer = rdb.table('_customer');
Customer.primaryColumn('cId').guid().as('id');
Customer.column('cBalance').numeric().as('balance');

var db = rdb('postgres://rdb:rdb@localhost/rdbdemo');

module.exports = resetDemo()
    .then(showBalance)
    .then(updateConcurrently)
    .then(showBalance)
    .then(onOk, onFailed);

function showBalance() {
    return db.transaction()
        .then(getById)
        .then(printBalance)
        .then(rdb.commit)
        .then(null, rdb.rollback);

    function printBalance(customer) {
        console.log('Balance: ' + customer.balance)
    }
}

function updateConcurrently() {
    var concurrent1 = db.transaction()
        .then(getById)
        .then(increaseBalance)
        .then(rdb.commit)
        .then(null, rdb.rollback);

    var concurrent2 = db.transaction()
        .then(getById)
        .then(increaseBalance)
        .then(rdb.commit)
        .then(null, rdb.rollback);
    return promise.all([concurrent1, concurrent2]);
}

function getById() {
    // pg_advisory_xact_lock(12345)
    return db.lock("12345").then(function() {
        return Customer.getById('a0000000-0000-0000-0000-000000000000');    
    });    
}

function increaseBalance(customer) {
    customer.balance += 100;
}

function onOk() {
    console.log('Success');
    console.log('Waiting for connection pool to teardown....');
}

function onFailed(err) {
    console.log('Rollback');
    console.log(err);
}
