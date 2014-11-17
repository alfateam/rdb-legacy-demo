var fs = require('fs');
var Promise = require('promise');
var conString = require('./connectionString');
var mySql = require('mysql');

var drop = "DROP TABLE IF EXISTS _compositeOrderLine;DROP TABLE IF EXISTS _compositeOrder;DROP TABLE IF EXISTS _deliveryAddress;DROP TABLE IF EXISTS _orderLine;DROP TABLE IF EXISTS _order;DROP TABLE IF EXISTS _customer;";
var createCustomer = "CREATE TABLE _customer (cId varchar(36) PRIMARY KEY, cName varchar(40), cBalance decimal(10,2), cRegdate timestamp, cIsActive boolean, cPicture blob);";
var createOrder = "CREATE TABLE _order (oId varchar(36) PRIMARY KEY, oOrderNo varchar(20), oCustomerId varchar(36));";
createOrder+= "ALTER TABLE _order ADD CONSTRAINT FOREIGN KEY(oCustomerId) REFERENCES _customer(cId);";
var createOrderLine = "CREATE TABLE _orderLine (lId varchar(36) PRIMARY KEY, lOrderId varchar(36) REFERENCES _order, lProduct varchar(40));";
createOrderLine+= "ALTER TABLE _orderLine ADD CONSTRAINT FOREIGN KEY(lOrderId) REFERENCES _order(oId);";
var createCompositeOrder = "CREATE TABLE _compositeOrder (oCompanyId decimal(10,2), oOrderNo decimal(10,2), oCustomerId varchar(36), PRIMARY KEY (oCompanyId,oOrderNo));";
createCompositeOrder+= "ALTER TABLE _compositeOrder ADD CONSTRAINT FOREIGN KEY(oCustomerId) REFERENCES _customer(cId);";
var createCompositeOrderLine = "CREATE TABLE _compositeOrderLine (lCompanyId decimal(10,2), lOrderNo decimal(10,2), lLineNo decimal(10,2), lProduct varchar(40), PRIMARY KEY (lCompanyId,lOrderNo, lLineNo));";
var createDeliveryAddress = "CREATE TABLE _deliveryAddress (dId varchar(36) PRIMARY KEY, dOrderId varchar(36), dName varchar(100), dStreet varchar(200), dPostalCode varchar(50), dPostalPlace varchar(200), dCountryCode varchar(2), dCountry varchar(100));";
createDeliveryAddress+= "ALTER TABLE _deliveryAddress ADD CONSTRAINT FOREIGN KEY(dOrderId) REFERENCES _order(oId);";

var createSql = drop + createCustomer + createOrder + createOrderLine + createDeliveryAddress + createCompositeOrder +  createCompositeOrderLine;
var buffer;
var buffer2;

createBuffers();

var insertCustomer1 = "INSERT INTO _customer VALUES ('a0000000-0000-0000-0000-000000000000','George',177,'2003-04-12 04:05:06 z',false," + buffer +  ");";
var insertCustomer2 = "INSERT INTO _customer VALUES ('b0000000-0000-0000-0000-000000000000','John',3045,'2014-05-11 06:49:40.297-0200',true," + buffer2 +  ");";
var insertCustomer3 = "INSERT INTO _customer VALUES ('12345678-0000-0000-0000-000000000000','Yoko',8765,'2012-02-10 07:00:40.297-0200',false," + buffer2 +  ");";
var insertCustomer4 = "INSERT INTO _customer VALUES ('87654321-0000-0000-0000-000000000000','Johnny',8123,'2011-03-11 06:00:40.297-0200',true," + buffer2 +  ");";
var insertCustomer5 = "INSERT INTO _customer VALUES ('87654399-0000-0000-0000-000000000000','Paul',8125,'2011-04-11 06:00:40.297-0200',true," + buffer2 +  ");";
var insertCustomers = insertCustomer1 + insertCustomer2 + insertCustomer3 + insertCustomer4 + insertCustomer5;
var insertOrders =
    "INSERT INTO _order VALUES ('a0000000-a000-0000-0000-000000000000','1000', 'a0000000-0000-0000-0000-000000000000');" +
    "INSERT INTO _order VALUES ('b0000000-b000-0000-0000-000000000000','1001', 'b0000000-0000-0000-0000-000000000000');" +
    "INSERT INTO _order VALUES ('c0000000-c000-0000-0000-000000000000','1002', null);" + 
    "INSERT INTO _order VALUES ('b0000000-d000-0000-0000-000000000000','1003', '87654399-0000-0000-0000-000000000000');" +
    "INSERT INTO _compositeOrder VALUES (1,1001, null);";
var insertOrderLines =
    "INSERT INTO _orderLine VALUES ('a0000000-a000-1000-0000-000000000000','a0000000-a000-0000-0000-000000000000','Bicycle');" +
    "INSERT INTO _orderLine VALUES ('a0000000-a000-1001-0000-000000000000','a0000000-a000-0000-0000-000000000000','A small car');" +
    "INSERT INTO _orderLine VALUES ('a0000000-a000-2000-0000-000000000000','a0000000-a000-0000-0000-000000000000','Skateboard');" +
    "INSERT INTO _orderLine VALUES ('b0000000-b000-1000-0000-000000000000','b0000000-b000-0000-0000-000000000000','Climbing gear');" +
    "INSERT INTO _orderLine VALUES ('b0000000-b000-2000-0000-000000000000','b0000000-b000-0000-0000-000000000000','Hiking shoes');" +
    "INSERT INTO _orderLine VALUES ('b0000000-b000-3000-0000-000000000000','b0000000-b000-0000-0000-000000000000','A big car');" + 
    "INSERT INTO _orderLine VALUES ('b0000000-b000-3100-0000-000000000000','b0000000-d000-0000-0000-000000000000','A yellow submarine');" + 
    "INSERT INTO _compositeOrderLine VALUES (1,1001,1,'Free lunch');" +
    "INSERT INTO _compositeOrderLine VALUES (1,1001,2,'Guide to the galaxy');";
var insertDeliveryAddress = "INSERT INTO _deliveryAddress values ('dddddddd-0000-0000-0000-000000000000','b0000000-b000-0000-0000-000000000000', 'Lars-Erik Roald', 'Node Street 1', '7030', 'Trondheim', 'NO', 'Norway');"
    
var insertSql = insertCustomers + insertOrders + insertOrderLines + insertDeliveryAddress;

function createBuffers() {
    buffer = newBuffer([1, 2, 3]);
    buffer2 = newBuffer([4, 5]);

    function newBuffer(contents) {
        var buffer = new Buffer(contents);
        return mySql.escape(buffer);
    }
}

function insert(onSuccess, onFailed) {
    var client = mySql.createConnection(conString);
    client.connect(function(err) {
        if (err) {
            console.log('Error while connecting: ' + err);
            onFailed(err);
            return;
        }
        client.query(createSql + insertSql, onInserted);

        function onInserted(err, result) {
            client.end();
            if (err) {
                console.error('error running query', err);
                onFailed(err);
                return;
            }
            onSuccess();
        }
    });
}


var resetOnce = new Promise(insert);
module.exports = function() {
    return resetOnce;
};