var rdb = require('rdb'),
    resetDemo = require('./db/resetDemo');
var promise = require('promise');

var Order = rdb.table('_compositeOrder');
var OrderLine = rdb.table('_compositeOrderLine');

Order.primaryColumn('oCompanyId').numeric().as('companyId');
Order.primaryColumn('oOrderNo').numeric().as('orderNo');

OrderLine.primaryColumn('lCompanyId').numeric().as('companyId');
OrderLine.primaryColumn('lOrderNo').numeric().as('orderNo');
OrderLine.primaryColumn('lLineNo').numeric().as('lineNo');
OrderLine.column('lProduct').string().as('product');

var line_order_relation = OrderLine.join(Order).by('lCompanyId','lOrderNo').as('order');
Order.hasMany(line_order_relation).as('lines');

var db = rdb('postgres://postgres:postgres@localhost/test');
var start;

module.exports = resetDemo()
    .then(db.transaction)
    .then(insertOrders)
    .then(getOrders)
    .then(traverse)
    .then(rdb.commit)
    .then(null, rdb.rollback)
    .then(onOk, onFailed);

function insertOrders() {
    for (var i = 0; i < 500; i++) {
        var order = Order.insert(1,i);
        for (var y = 0; y < 20; y++) {
            var line = OrderLine.insert(1,i,y);
        }
    }
}

function getOrders() {
    return Order.getMany(null, {lines : null});
}

function getOrderById() {
    return Order.getById(1,0, {lines : null});
}

function traverse(orders) {
    start = new Date();
    var all = [];
    for (var i = 0; i < orders.length; i++) {
        console.log(orders[i].orderNo);
        var traversOrder = orders[i].lines.then(onLines);
        all.push(traversOrder);
    }
    return promise.all(all)
}

function onLines(lines) {
    for (var i = 0; i <  lines.length; i++) {
        var line = lines[i];
    }
}

function onOk() {
    console.log('Success');
    var end = new Date() - start;
    console.info("Execution time: %dms", end);
    console.log('Waiting for connection pool to teardown....');
}

function onFailed(err) {
    console.log('Rollback');
    console.log(err.stack);
}