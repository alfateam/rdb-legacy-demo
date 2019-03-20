var rdb = require('rdb'),
    resetDemo = require('./db/resetDemo');
rdb.log(console.log);

var Order = rdb.table('_jOrder');

Order.primaryColumn('oId').guid().as('id');
Order.column('oData').string().as('data'); // Contains JSON data

var db = rdb('postgres://postgres:postgres@localhost/test');

module.exports = resetDemo()
    .then(db.transaction)
    .then(getOrder)
    .then(printOrders)
    .then(rdb.commit)
    .then(null, rdb.rollback)
    .then(onOk, onFailed);

function getOrder() {
    var strategy = {
        orderBy: ['data->\'orderNo\''] 
        //alternative: orderBy: ['data->>\'orderId\' asc']
    };
    return Order.getMany(null, strategy);
}

function printOrders(orders) {
    orders.forEach(printOrder);

    function printOrder(order) {
        var format = 'Order Id: %s, Order Data: %s'; 
        var args = [format, order.id, JSON.stringify(order.data)];
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
