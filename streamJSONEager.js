let rdb = require('rdb');
let resetDemo = require('./db/resetDemo');

let Order = rdb.table('_order');
let OrderLine = rdb.table('_orderLine');

Order.primaryColumn('oId').guid().as('id');
Order.column('oOrderNo').string().as('orderNo');

OrderLine.primaryColumn('lId').guid().as('id');
OrderLine.column('lOrderId').guid().as('orderId');
OrderLine.column('lProduct').string().as('product');

let line_order_relation = OrderLine.join(Order).by('lOrderId').as('order');
Order.hasMany(line_order_relation).as('lines');

let db = rdb('postgres://rdb:rdb@localhost/rdbdemo');

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
	} catch (e) {
		console.log(e.stack);
	}
}();