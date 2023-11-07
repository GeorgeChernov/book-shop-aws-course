"use strict";

const AWS = require("aws-sdk");

AWS.config.setPromisesDependency(require("bluebird"));

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.createProduct = async (event, context, callback) => {
  const id = context.awsRequestId;

  var productParams = {
    TableName: "products",
    ProjectionExpression: "id, title, description, price",
    Item: mapToProductItem(event, id)
  };

  var stocksParams = {
    TableName: "stocks",
    ProjectionExpression: "productId, itemCount",
    Item: mapToStockItem(event, id)
  };

  await dynamoDb.put(productParams).promise();
  await dynamoDb.put(stocksParams).promise();
  
  return callback(null, {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "OPTIONS, POST, GET",
    },
    body: id,
  });
};

function mapToProductItem(event, id) {
  return {
    id,
    title: event.title,
    description: event.description,
    price: event.price
  };
}

function mapToStockItem(event, id) {
  return {
    productId: id,
    itemCount: event.count
  };
}
