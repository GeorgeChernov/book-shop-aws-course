"use strict";

const AWS = require("aws-sdk");

AWS.config.setPromisesDependency(require("bluebird"));

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.getProducts = (event, context, callback) => {
  var productsParams = {
    TableName: "products",
    ProjectionExpression: "id, title, description, price",
  };

  var stocksParams = {
    TableName: "stocks",
    ProjectionExpression: "productId, itemCount",
  };

  console.log("Scanning Products table.");

  let products = [];

  const onScanProducts = (err, data) => {
    console.log("In onScanProducts.");

    if (err) {
      console.log(
        "Scan failed to load data. Error JSON:",
        JSON.stringify(err, null, 2)
      );

      callback(err);
    } else {
      console.log("Scan succeeded.", data.Items);

      products = data.Items;

      dynamoDb.scan(stocksParams, onScanStocks);
    }
  };

  const onScanStocks = (err, data) => {
    console.log("In onScanStocks.");

    if (err) {
      console.log(
        "Scan failed to load data. Error JSON:",
        JSON.stringify(err, null, 2)
      );

      callback(err);
    } else {
      console.log("Scan succeeded.", data.Items);

      let result = [];

      for (let i = 0; i < products.length; i++) {
        const stock = data.Items.find((x) => x.productId === products[i].id);

        result.push({ ...products[i], count: stock.itemCount });
      }

      return callback(null, {
        statusCode: 200,
        headers: {
            "Access-Control-Allow-Headers" : "Content-Type",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "OPTIONS, POST, GET"
        },
        body: JSON.stringify(result),
      });
    }
  };

  dynamoDb.scan(productsParams, onScanProducts);
};
