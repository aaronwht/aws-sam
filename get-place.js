'use strict'
const AWS = require('aws-sdk')
AWS.config.update({ region: process.env.Region, apiVersion: '2012-08-10' })
if (process.env.AWS_SAM_LOCAL) AWS.config.update({ dynamodb: { endpoint: process.env.DynamoDbEndpoint } })

const docClient = new AWS.DynamoDB.DocumentClient()

module.exports.handler = async (event) => {
    try {
        const { Item } = await docClient.get({ TableName: 'places', Key: { placeKey: event.pathParameters.id } }).promise()
        const place = Item
        return {
            statusCode: 200,
            headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: 'success', place })
          }
    } catch (err) {
        console.error(err)
        return {
            statusCode: 200,
            headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' },
            status: 'error',
            message: err
        }
    }
}