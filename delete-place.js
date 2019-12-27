'use strict'
const AWS = require('aws-sdk')

AWS.config.update({ region: process.env.Region, apiVersion: '2012-08-10' })
if (process.env.AWS_SAM_LOCAL) AWS.config.update({ dynamodb: { endpoint: process.env.DynamoDbEndpoint } })

const docClient = new AWS.DynamoDB.DocumentClient()
const s3 = new AWS.S3({
    apiVersion: '2006-03-01',
    signatureVersion: 'v4',
    Bucket: process.env.UploadPictureBucket,
})

module.exports.handler = async (event) => {
    try {
        const body = typeof event.body !== 'undefined' ? JSON.parse(event.body) : event
        const { placeKey } = body

        if (!placeKey) {
            console.warn("placeKey not specified")
            return {
                statusCode: 200,
                headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    status: 'error',
                    message: 'Please specify a place to delete'
                })
            }
        }

        try {
            const { Item } = await docClient.get({ TableName: 'places', Key: { placeKey } }).promise()
            const place = Item

            if (place.picture) {
                try {
                    const pictureParams = {
                        Bucket: process.env.UploadPictureBucket,
                        Key: place.picture
                    }
                    await s3.deleteObject(pictureParams).promise()
                    await deletePlace(placeKey)
                    
                    return {
                        statusCode: 200,
                        headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            status: 'success',
                        })
                    }
                } catch (err) {
                    console.error(err)

                    return {
                        statusCode: 200,
                        headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            status: 'error',
                        })
                    }
                }
            }
            await deletePlace(placeKey)

            return {
                statusCode: 200,
                headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: 'success' })
            }
        } catch(err) {
            console.error(err)

            return {
                statusCode: 200,
                headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    status: 'error',
                    message: err.message,
                    placeKey
                })
            }
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

async function deletePlace(placeKey) {
    try {
        const params = {
            TableName: "places",
            Key: { "placeKey": placeKey }
        }
        await docClient.delete(params).promise()
    } catch (err) {
        console.error(err)
    }
}