var init = require('./db/init');
var db = require('./db/myDb');
var Order = require('./db/order');
var Customer = require('./db/customer');

var promise = require('promise');
var commit, rollback;

insertThenGet();

function insertThenGet() {
    init(runDbTest, onFailed);
}

function runDbTest() {
    var transaction = db.transaction();
    commit = transaction.commit;
    rollback = transaction.rollback;

    transaction.then(getCustomer).then(printCustomer).then(commit).then(null, rollback).then(onOk, onFailed).then(final);
}

function getCustomer() {
    return Customer.getById("100");
}

function printCustomer(customer) {
    return customer.toJSON().then(printJSON);
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