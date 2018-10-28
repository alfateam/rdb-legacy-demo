const rdb = require('rdb');
const resetDemo = require('./db/resetDemo');

const Order = rdb.table('_order');
const OrderLine = rdb.table('_orderLine');

Order.primaryColumn('oId').guid().as('id');
Order.column('oOrderNo').string().as('orderNo');

OrderLine.primaryColumn('lId').guid().as('id');
OrderLine.column('lOrderId').guid().as('orderId');
OrderLine.column('lProduct').string().as('product');

const line_order_relation = OrderLine.join(Order).by('lOrderId').as('order');
Order.hasMany(line_order_relation).as('lines');

const db = rdb('postgres://rdb:rdb@localhost/rdbdemo');

module.exports = async function() {
	try {
		await resetDemo();
		let emptyFilter;
		let strategy = {
			lines: {
				orderBy: ['product']
			},
			orderBy: ['orderNo'],
			limit: 5,
		};
		await Order.createJSONReadStream(db, emptyFilter, strategy).pipe(process.stdout);
		console.log('Waiting for connection pool to teardown....');
	} catch (e) {
		console.log(e.stack);
	}
}();