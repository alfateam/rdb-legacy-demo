var fs = require('fs');
var promise = require('promise/domains');
var conString = require('./connectionString');
// var conString = ':memory:';
var sqlite = require('sqlite3');

var drop = ["DROP TABLE IF EXISTS _compositeOrderLine", "DROP TABLE IF EXISTS _compositeOrder", "DROP TABLE IF EXISTS _deliveryAddress", "DROP TABLE IF EXISTS _orderLine", "DROP TABLE IF EXISTS _order", "DROP TABLE IF EXISTS _customer", "DROP TABLE IF EXISTS _user"]
var createCustomer = ["CREATE TABLE _customer (cId TEXT PRIMARY KEY, cName TEXT, cBalance NUMERIC, cRegdate TEXT, cIsActive INTEGER, cPicture BLOB, cDocument TEXT)"]
var createUser = ["CREATE TABLE _user (uId TEXT PRIMARY KEY, uUserId TEXT, uPassword TEXT, uEmail TEXT)"]
var createOrder = ["CREATE TABLE _order (oId TEXT PRIMARY KEY, oOrderNo TEXT, oCustomerId TEXT  REFERENCES _customer)"]
var createOrderLine = ["CREATE TABLE _orderLine (lId TEXT PRIMARY KEY, lOrderId TEXT REFERENCES _order, lProduct TEXT)"]
var createCompositeOrder = ["CREATE TABLE _compositeOrder (oCompanyId NUMERIC, oOrderNo NUMERIC, oCustomerId TEXT  REFERENCES _customer, PRIMARY KEY (oCompanyId,oOrderNo))"];
var createCompositeOrderLine = ["CREATE TABLE _compositeOrderLine (lCompanyId NUMERIC, lOrderNo NUMERIC, lLineNo NUMERIC, lProduct TEXT, PRIMARY KEY (lCompanyId,lOrderNo, lLineNo))"];
var createDeliveryAddress = ["CREATE TABLE _deliveryAddress (dId TEXT PRIMARY KEY, dOrderId TEXT REFERENCES _order, dName TEXT, dStreet TEXT, dPostalCode TEXT, dPostalPlace TEXT, dCountryCode TEXT, dCountry TEXT)"];

var createSql = drop.concat(createCustomer, createOrder, createOrderLine, createDeliveryAddress, createCompositeOrder, createCompositeOrderLine, createUser);
var buffer = new Buffer([1, 2, 3]);
var buffer2 = new Buffer([4, 5]);

createBuffers();

var insertCustomer1 = "INSERT INTO _customer VALUES ('a0000000-0000-0000-0000-000000000000','George',177,'2003-04-12 04:05:06',0,?, '[\"foo\", 1, {\"bar\": true}]')";
var insertCustomer1 = "INSERT INTO _customer VALUES ('a0000000-0000-0000-0000-000000000000','George',177,'2003-04-12 04:05:06',0,?, '[\"foo\", 1, {\"bar\": true}]')";
var insertCustomer2 = "INSERT INTO _customer VALUES ('b0000000-0000-0000-0000-000000000000','John',3045,'2014-05-11 06:49:40.297',1,?,null)";
var insertCustomer3 = "INSERT INTO _customer VALUES ('12345678-0000-0000-0000-000000000000','Yoko',8765,'2012-02-10 07:00:40.297',0,?,null)";
var insertCustomer4 = "INSERT INTO _customer VALUES ('87654321-0000-0000-0000-000000000000','Johnny',8123,'2011-03-11 06:00:40.297',1,?,null)";
var insertCustomer5 = "INSERT INTO _customer VALUES ('87654399-0000-0000-0000-000000000000','Paul',8125,'2011-04-11 06:00:40.297',1,?,null)";
// var insertCustomers = insertCustomer1.concat(insertCustomer2, insertCustomer3, insertCustomer4, insertCustomer5);

var insertUser1 = ["INSERT INTO _user VALUES ('87654400-0000-0000-0000-000000000000','paul','secretPassword','paul@mccartney.net')"];
var insertUser2 = ["INSERT INTO _user VALUES ('97654400-0000-0000-0000-000000000000','john','myPassword','john@lennon.net')"];
var insertUsers = insertUser1.concat(insertUser2);

var insertOrders = [
    "INSERT INTO _order VALUES ('a0000000-a000-0000-0000-000000000000','1000', 'a0000000-0000-0000-0000-000000000000')",
    "INSERT INTO _order VALUES ('b0000000-b000-0000-0000-000000000000','1001', 'b0000000-0000-0000-0000-000000000000')",
    "INSERT INTO _order VALUES ('c0000000-c000-0000-0000-000000000000','1002', null)",
    "INSERT INTO _order VALUES ('b0000000-d000-0000-0000-000000000000','1003', '87654399-0000-0000-0000-000000000000')",
    "INSERT INTO _order VALUES ('d0000000-e000-0000-0000-000000000000','1004', 'a0000000-0000-0000-0000-000000000000')",
    "INSERT INTO _compositeOrder VALUES (1,1001, null)"
];
var insertOrderLines = [
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
var insertDeliveryAddress = ["INSERT INTO _deliveryAddress values ('dddddddd-0000-0000-0000-000000000000','b0000000-b000-0000-0000-000000000000', 'Lars-Erik Roald', 'Node Street 1', '7030', 'Trondheim', 'NO', 'Norway')"]

var insertSql = [].concat(insertOrders, insertOrderLines, insertDeliveryAddress, insertUsers);
// var queries = [].concat(createSql);

function createBuffers() {
    buffer = Buffer.from([1, 2, 3]);
    buffer2 = Buffer.from([4, 5]);
}

function insert(onSuccess, onFailed) {
    var client = new sqlite.Database(conString);

    client.serialize(function() {
        for (var i = 0; i < createSql.length; i++) {
            client.run(createSql[i]);
        }

        client.run(insertCustomer1, buffer);
        client.run(insertCustomer2, buffer2);
        client.run(insertCustomer3, buffer2);
        client.run(insertCustomer4, buffer2);
        client.run(insertCustomer5, buffer2);
        var query;
        for (var i = 0; i < insertSql.length; i++) {
            if (i === insertSql.length - 1)
                // client.run(insertSql[i], onLastQueryDone);
                client.run("select order_0.lId as sorder_00,order_0.lproduct as sorder_01,order_0.lOrderId as sorder_02 from _orderLine order_0 where order_0.lOrderId IN (select * from (select _order.oid as sorder0 from _order _order where _order.oorderno like '%00%' order by _order.oCustomerId desc limit 3) sub);", onLastQueryDone);

            else
                client.run(insertSql[i]);
        }
        // client.run("delete from _orderLine where _orderLine.rowId in (SELECT _2.rowId FROM _orderLine _2 where EXISTS (SELECT _1.oId FROM _order AS _1 INNER JOIN _customer _customer ON (_1.oCustomerId=_customer.cId) WHERE _2.lOrderId=_1.oId AND _customer.cId='87654399-0000-0000-0000-000000000000'))", onLastQueryDone)
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

// var resetOnce = new promise(insert);
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

var resetOnce = new promise(insert);
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
