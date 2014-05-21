var init = require('./db/init');
var db = require('./db/myDb');
var Order = require('./db/order');
var Customer = require('./db/customer');

var commit, rollback;

insertThenGet();

function insertThenGet() {
    init(runDbTest, onFailed);
}

function runDbTest() {
    var transaction = db.transaction();
    commit = transaction.commit;
    rollback = transaction.rollback;

    transaction.then(getCustomers).then(printAll).then(commit).then(null, rollback).then(onOk, onFailed).then(final);
}

function getCustomers() {
    return Customer.getMany();
}

function printAll(customers) {
    return customers.toJSON().then(printJSON);
}

function printJSON(json) {    
    console.log(json);
}

function onOk() {
    console.log('Success.');
}

function final() {
    console.log('Waiting for connection pool to teardown....');
}

function onFailed(err) {
    console.log('failed: ' + err);
    if (err.stack)
        console.log('stack: ' + err.stack);
}