"use strict";
const DynamoDB = require("aws-sdk/clients/dynamodb");
const documentClient = new DynamoDB.DocumentClient({ region: "us-east-1" });
const NOTES_TABLE_NAME = process.env.NOTES_TABLE_NAME;
console.log(NOTES_TABLE_NAME);
const send = (statusCode, data) => {
  return {
    statusCode,
    body: JSON.stringify(data),
  };
};

module.exports.createNote = async (event) => {
  try {
    let data = JSON.parse(event.body);
    console.log(data);
    console.log(event);
    console.log(NOTES_TABLE_NAME);

    const params = {
      TableName: NOTES_TABLE_NAME,
      Item: {
        notesId: data.id,
        title: data.title,
        body: data.body,
      },
      ConditionExpression: "attribute_not_exists(notesId)",
    };
    await documentClient.put(params).promise();
    return send(201, data);
  } catch (error) {
    return send(500, error.message);
  }
};
