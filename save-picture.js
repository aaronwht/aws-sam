'use strict'
const AWS = require('aws-sdk')

AWS.config.update({ region: process.env.Region, apiVersion: '2012-08-10' })
if (process.env.AWS_SAM_LOCAL) AWS.config.update({ dynamodb: { endpoint: process.env.DynamoDbEndpoint } })

const docClient = new AWS.DynamoDB.DocumentClient()

module.exports.handler = async (event) => {  
    try {
        const body = JSON.parse(JSON.stringify(event.body))
        const { placeKey, picture } = JSON.parse(body)

        if (!placeKey || !picture) {
            return {
                statusCode: 200,
                headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    status: 'error',
                    message: 'There was an error processing your request.'
                })
            }
        }
        
        const params = {
            TableName: 'places',
            Key: { placeKey },
            UpdateExpression: "set picture = :picture",
            ExpressionAttributeValues:{
                ":picture":picture,
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