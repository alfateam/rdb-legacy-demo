let rdb = require('rdb'),
    resetDemo = require('./db/resetDemo');

let Order = rdb.table('_compositeOrder');
let OrderLine = rdb.table('_compositeOrderLine');

Order.primaryColumn('oCompanyId').numeric().as('companyId');
Order.primaryColumn('oOrderNo').numeric().as('orderNo');

OrderLine.primaryColumn('lCompanyId').numeric().as('companyId');
OrderLine.primaryColumn('lOrderNo').numeric().as('orderNo');
OrderLine.primaryColumn('lLineNo').numeric().as('lineNo');
OrderLine.column('lProduct').string().as('product');

let line_order_relation = OrderLine.join(Order).by('lCompanyId', 'lOrderNo').as('order');
Order.hasMany(line_order_relation).as('lines');

let db = rdb.sqlite(__dirname + '/db/rdbDemo');

module.exports = resetDemo()
    .then(db.transaction)
    .then(getOrder)
    .then(printOrder)
    .then(printLines)
    .then(rdb.commit)
    .then(null, rdb.rollback)
    .then(onOk, onFailed);

function getOrder() {
    let companyId = 1,
        orderId = 1001;
    return Order.getById(companyId, orderId);
}

function printOrder(order) {
    console.log('Company Id: %s, Order No: %s', order.companyId, order.orderNo)
    return order.lines; //this is a promise
}

function printLines(lines) {
    lines.forEach(printLine);

    function printLine(line) {
        let format = 'Company Id: %s, Order No: %s, Line No: %s, Product: %s';
        let args = [format, line.companyId, line.orderNo, line.lineNo, line.product];
        console.log.apply(null,args);
    }
}

function onOk() {
    console.log('Success');
    console.log('Waiting for connection pool to teardown....');
}

function onFailed(err) {
    console.log('Rollback');
    console.log(err);
}