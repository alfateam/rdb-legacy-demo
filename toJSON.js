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

    transaction.then(getCustomers).then(printAll).then(commit).then(null, rollback).done(onOk, onFailed);
}

function getCustomers() {
    return Customer.getMany();
}

function printAll(customers) {
    var all = [];
    for (var i = 0; i < customers.length; i++) {        
        all.push(customers[i].toJSON().then(printCustomer));
    };
    return promise.all(all);
}

function printCustomer(json) {    
    console.log(json);
}

function onOk() {
    console.log('done. Waiting for connection pool to teardown....');
}

function onFailed(err) {
    console.log('failed: ' + err);
    if (err.stack)
        console.log('stack: ' + err.stack);
}