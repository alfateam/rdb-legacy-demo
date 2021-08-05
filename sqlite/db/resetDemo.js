let fs = require('fs');
let promise = require('promise/domains');
let conString = require('./connectionString');
// let conString = ':memory:';
let sqlite = require('sqlite3');

let drop = ["DROP TABLE IF EXISTS _compositeOrderLine", "DROP TABLE IF EXISTS _compositeOrder", "DROP TABLE IF EXISTS _deliveryAddress", "DROP TABLE IF EXISTS _orderLine", "DROP TABLE IF EXISTS _order", "DROP TABLE IF EXISTS _customer", "DROP TABLE IF EXISTS _user"]
let createCustomer = ["CREATE TABLE _customer (id TEXT PRIMARY KEY, name TEXT, balance NUMERIC, regdate TEXT, isActive INTEGER, picture BLOB, document TEXT)"]
let createUser = ["CREATE TABLE _user (id TEXT PRIMARY KEY, userId TEXT, password TEXT, email TEXT)"]
let createOrder = ["CREATE TABLE _order (id TEXT PRIMARY KEY, orderNo TEXT, customerId TEXT  REFERENCES _customer)"]
let createOrderLine = ["CREATE TABLE _orderLine (id TEXT PRIMARY KEY, orderId TEXT REFERENCES _order, product TEXT)"]
let createCompositeOrder = ["CREATE TABLE _compositeOrder (companyId NUMERIC, orderNo NUMERIC, customerId TEXT  REFERENCES _customer, PRIMARY KEY (companyId,orderNo))"];
let createCompositeOrderLine = ["CREATE TABLE _compositeOrderLine (companyId NUMERIC, orderNo NUMERIC, lineNo NUMERIC, product TEXT, PRIMARY KEY (companyId,orderNo, lineNo))"];
let createDeliveryAddress = ["CREATE TABLE _deliveryAddress (id TEXT PRIMARY KEY, orderId TEXT REFERENCES _order, name TEXT, street TEXT, postalCode TEXT, postalPlace TEXT, countryCode TEXT, country TEXT)"];

let createSql = drop.concat(createCustomer, createOrder, createOrderLine, createDeliveryAddress, createCompositeOrder, createCompositeOrderLine, createUser);
let buffer;
let buffer2;

createBuffers();

let insertCustomer1 = "INSERT INTO _customer VALUES ('a0000000-0000-0000-0000-000000000000','George',177,'2003-04-12 04:05:06',0,?, '[\"foo\", 1, {\"bar\": true}]')";
let insertCustomer2 = "INSERT INTO _customer VALUES ('b0000000-0000-0000-0000-000000000000','John',3045,'2014-05-11 06:49:40.297',1,?,null)";
let insertCustomer3 = "INSERT INTO _customer VALUES ('12345678-0000-0000-0000-000000000000','Yoko',8765,'2012-02-10 07:00:40.297',0,?,null)";
let insertCustomer4 = "INSERT INTO _customer VALUES ('87654321-0000-0000-0000-000000000000','Johnny',8123,'2011-03-11 06:00:40.297',1,?,null)";
let insertCustomer5 = "INSERT INTO _customer VALUES ('87654399-0000-0000-0000-000000000000','Paul',8125,'2011-04-11 06:00:40.297',1,?,null)";
// let insertCustomers = insertCustomer1.concat(insertCustomer2, insertCustomer3, insertCustomer4, insertCustomer5);

let insertUser1 = ["INSERT INTO _user VALUES ('87654400-0000-0000-0000-000000000000','paul','secretPassword','paul@mccartney.net')"];
let insertUser2 = ["INSERT INTO _user VALUES ('97654400-0000-0000-0000-000000000000','john','myPassword','john@lennon.net')"];
let insertUsers = insertUser1.concat(insertUser2);

let insertOrders = [
    "INSERT INTO _order VALUES ('a0000000-a000-0000-0000-000000000000','1000', 'a0000000-0000-0000-0000-000000000000')",
    "INSERT INTO _order VALUES ('b0000000-b000-0000-0000-000000000000','1001', 'b0000000-0000-0000-0000-000000000000')",
    "INSERT INTO _order VALUES ('c0000000-c000-0000-0000-000000000000','1002', null)",
    "INSERT INTO _order VALUES ('b0000000-d000-0000-0000-000000000000','1003', '87654399-0000-0000-0000-000000000000')",
    "INSERT INTO _order VALUES ('d0000000-e000-0000-0000-000000000000','1004', 'a0000000-0000-0000-0000-000000000000')",
    "INSERT INTO _compositeOrder VALUES (1,1001, null)"
];
let insertOrderLines = [
    "INSERT INTO _orderLine VALUES ('a0000000-a000-1000-0000-000000000000','a0000000-a000-0000-0000-000000000000','Bicycle')",
    "INSERT INTO _orderLine VALUES ('a0000000-a000-1001-0000-000000000000','a0000000-a000-0000-0000-000000000000','A small car')",
    "INSERT INTO _orderLine VALUES ('a0000000-a000-2000-0000-000000000000','a0000000-a000-0000-0000-000000000000','Skateboard')",
    "INSERT INTO _orderLine VALUES ('b0000000-b000-1000-0000-000000000000','b0000000-b000-0000-0000-000000000000','Climbing gear')",
    "INSERT INTO _orderLine VALUES ('b0000000-b000-2000-0000-000000000000','b0000000-b000-0000-0000-000000000000','Hiking shoes')",
    "INSERT INTO _orderLine VALUES ('b0000000-b000-3000-0000-000000000000','b0000000-b000-0000-0000-000000000000','A big car')",
    "INSERT INTO _orderLine VALUES ('b0000000-b000-3100-0000-000000000000','b0000000-d000-0000-0000-000000000000','A yellow submarine')",
    "INSERT INTO _compositeOrderLine VALUES (1,1001,1,'Free lunch')",
    "INSERT INTO _compositeOrderLine VALUES (1,1001,2,'Guide to the galaxy')"
];
let insertDeliveryAddress = ["INSERT INTO _deliveryAddress values ('dddddddd-0000-0000-0000-000000000000','b0000000-b000-0000-0000-000000000000', 'Lars-Erik Roald', 'Node Street 1', '7030', 'Trondheim', 'NO', 'Norway')"]

let insertSql = [].concat(insertOrders, insertOrderLines, insertDeliveryAddress, insertUsers);
// let queries = [].concat(createSql);

function createBuffers() {
    buffer = Buffer.from([1, 2, 3]);
    buffer2 = Buffer.from([4, 5]);
}

function insert(onSuccess, onFailed) {
    let client = new sqlite.Database(conString);

    client.serialize(function() {
        for (let i = 0; i < createSql.length; i++) {
            client.run(createSql[i]);
        }

        client.run(insertCustomer1, buffer);
        client.run(insertCustomer2, buffer2);
        client.run(insertCustomer3, buffer2);
        client.run(insertCustomer4, buffer2);
        client.run(insertCustomer5, buffer2);
        let query;
        for (let i = 0; i < insertSql.length; i++) {
            if (i === insertSql.length - 1)
                // client.run(insertSql[i], onLastQueryDone);
                client.run("select order_0.id as sorder_00,order_0.product as sorder_01,order_0.orderId as sorder_02 from _orderLine order_0 where order_0.orderId IN (select * from (select _order.id as sorder0 from _order _order where _order.orderNo like '%00%' order by _order.customerId desc limit 3) sub);", onLastQueryDone);

            else
                client.run(insertSql[i]);
        }
        // client.run("delete from _orderLine where _orderLine.rowId in (SELECT _2.rowId FROM _orderLine _2 where EXISTS (SELECT _1.oId FROM _order AS _1 INNER JOIN _customer _customer ON (_1.customerId=_customer.id) WHERE _2.orderId=_1.oId AND _customer.id='87654399-0000-0000-0000-000000000000'))", onLastQueryDone)
    });

    function onLastQueryDone(e,e2) {
        if (e)
            console.log(e.stack);
        // console.log(e)
        client.close();
        onSuccess();
    }
}
// insert(onOk, onError);

// let resetOnce = new promise(insert);
// resetOnce.then(onOk,onError);

// function onOk() {
//     console.log('ok');
// }

// function onError(e) {

//     console.log(e.stack);

// }
// module.exports = function() {
//     return resetOnce;
// };

let resetOnce = new promise(insert);
// resetOnce.then(onOk, onError);

function onOk(row) {
    console.log(row);
}

function onError(e) {
    console.log(e.stack);
}
module.exports = function() {
    return resetOnce;
};
