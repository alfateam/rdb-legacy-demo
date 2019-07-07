var inspect = require('util').inspect;
var rdb = require('rdb'),
    resetDemo = require('../db/resetDemo');

var Order = rdb.table('_order');
Order.primaryColumn('oId').guid().as('id');
Order.column('oOrderNo').string().as('orderNo');
Order.column('oCustomerId').guid().as('customerId');

var Customer = rdb.table('_customer');
Customer.primaryColumn('cid').guid().as('id');
Customer.column('cName').string().as('name');
Customer.column('cBalance').string().as('balance');
Customer.column('cIsActive').boolean().as('isActive');

var orderCustomerJoin = Order.join(Customer).by('oCustomerId').as('customer');
Customer.hasMany(orderCustomerJoin).as('orders');

var db = rdb('postgres://rdb:rdb@localhost/rdbdemo');

module.exports = resetDemo()
    .then(db.transaction)
    .then(getOrders)
    .then(printOrders)
    .then(db.commit)
    .then(null, db.rollback)
    .then(onOk, console.log);

function getOrders() {
    var filter = {
        sql: 'exists (select 1 from _customer where _customer.cId = oCustomerId and _customer.cBalance > 3000 and _customer.cName LIKE ?)',
        parameters: ['%o%']
    };
    return Order.getMany(filter);
}

function printOrders(orders) {
    var strategy = {customer: null}
    return orders.toDto(strategy).then(printDtos);
}

function printDtos(dtos) {
    console.log(inspect(dtos,false,10));
}

function onOk() {
    console.log('Done');
}