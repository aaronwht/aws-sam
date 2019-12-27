'use strict'
const AWS = require('aws-sdk')
AWS.config.update({ region: process.env.Region, apiVersion: '2012-08-10' })
if (process.env.AWS_SAM_LOCAL) AWS.config.update({ dynamodb: { endpoint: process.env.DynamoDbEndpoint } })

const docClient = new AWS.DynamoDB.DocumentClient()

module.exports.handler = async (event) => {
    try {
        const body = typeof event.body !== 'undefined' ? JSON.parse(event.body) : event
        const { placeKey, city, stateOrProvince, countryCode } = body

        if (!placeKey) {
            return {
                statusCode: 200,
                headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    status: 'error',
                    message: 'A place was not provided'
                })
            }
        }

        if (!city || !stateOrProvince || !countryCode) {
            return {
                statusCode: 200,
                headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    status: 'error',
                    message: 'Please complete all fields'
                })
            }
        }

        const params = {
            TableName: 'places',
            Key: { placeKey },
            UpdateExpression: "set city = :city, stateOrProvince = :stateOrProvince, countryCode = :countryCode",
            ExpressionAttributeValues:{
                ":city":city,
                ":stateOrProvince":stateOrProvince,
                ":countryCode":countryCode,
            },
            ReturnValues:"UPDATED_NEW"
        }
        await docClient.update(params).promise()
        return {
            statusCode: 200,
            headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' },
            body: JSON.stringify({
                status: 'success',
                message: 'Place successfully updated',
                placeKey
            })
        }
    } catch (err) {
        return {
            statusCode: 200,
            headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' },
            body: JSON.stringify({
                status: 'error',
                message: err.message
            })
        }
    }
}