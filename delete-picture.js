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
    const body = typeof event.body !== 'undefined' ? JSON.parse(event.body) : event
    const { placeKey, picture } = body

    if (!placeKey || !picture) {
        return {
            statusCode: 200,
            headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: 'error', message: 'Please sepecity a picture' })
        }
    }
    
    try {
        const params = {
            Bucket: process.env.UploadPictureBucket,
            Key: picture
        }
        await s3.deleteObject(params).promise()
        await deletePicture(placeKey)
        
        return {
            statusCode: 200,
            headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: 'success' })
        }
    } catch (err) {
        console.error(err)
        // delete record from db even if picture doesn't exist
        await deletePicture(placeKey)

        return {
            statusCode: 200,
            headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: 'error' })
        }
    }
}

async function deletePicture(placeKey) {
    const removeParams = {
        TableName: 'places',
        Key: { placeKey },
        UpdateExpression: "REMOVE picture",
        ReturnValues:"ALL_NEW"
    }
    await docClient.update(removeParams).promise()
}