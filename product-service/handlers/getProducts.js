"use strict";

const AWS = require("aws-sdk");

AWS.config.setPromisesDependency(require("bluebird"));

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.getProducts = async (event, context, callback) => {
  var productsParams = {
    TableName: "products",
    ProjectionExpression: "id, title, description, price",
  };

  var stocksParams = {
    TableName: "stocks",
    ProjectionExpression: "productId, itemCount",
  };

  const products = await dynamoDb
    .scan(productsParams)
    .promise()
    .then((data) => data.Items);
  const stocks = await dynamoDb
    .scan(stocksParams)
    .promise()
    .then((data) => data.Items);

  let result = [];

  for (let i = 0; i < products.length; i++) {
    const stock = stocks.find((x) => x.productId === products[i].id);

    result.push({ ...products[i], count: stock.itemCount });
  }

  return callback(null, {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "OPTIONS, POST, GET",
    },
    body: JSON.stringify(result),
  });
};
