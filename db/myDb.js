var rdb = require('rdb');
var table = rdb.table;
var customer = require('./customer');
var order = require('./order');

var customerOrder = order.join(customer).by('oCustomerId').as('customer');
customer.hasMany(customerOrder).as('orders');

var conString = 'postgres://postgres:postgres@localhost/test';
var db = rdb(conString);

module.exports = db;

