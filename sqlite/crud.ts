import {OrderTable} from "../models"
import * as rdb from 'rdb-client'
let Order = rdb.table<OrderTable>('http://localhost:8080/order');

run();

async function run() {
    let filter = Order.orderNo.notEqual(null);
    let orders = await Order.getMany(filter);
    console.log(orders);
}