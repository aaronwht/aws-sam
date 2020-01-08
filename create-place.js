'use strict'
const AWS = require('aws-sdk')
const uuidv4 = require('uuid/v4')

AWS.config.update({ region: process.env.Region, apiVersion: '2012-08-10' })
if (process.env.AWS_SAM_LOCAL) AWS.config.update({ dynamodb: { endpoint: process.env.DynamoDbEndpoint } })

const docClient = new AWS.DynamoDB.DocumentClient()

module.exports.handler = async (event) => {  
    try {
        const body = typeof event.body !== 'undefined' ? JSON.parse(event.body) : event
        const { city, stateOrProvince, countryCode } = body
        
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

        const placeKey = uuidv4()
        const params = {
            TableName: 'places',
            Item: { placeKey, city, stateOrProvince, countryCode }
        }
        await docClient.put(params).promise()
        return {
            statusCode: 200,
            headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' },
            body: JSON.stringify({
                status: 'success',
                message: 'Place successfully created',
                placeKey
            })
        }
    } catch (err) {
        console.error(err)
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