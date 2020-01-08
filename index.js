'use strict'
/*
docker run -p 8000:8000 -v $(pwd)/local/dynamodb:/data/ amazon/dynamodb-local -jar DynamoDBLocal.jar -sharedDb -dbPath /data
sam local start-api --port 3030 --skip-pull-image

- Packages a cloud formation template and app and uploads it to your specified AWS Bucket
aws cloudformation package --template-file template.yaml --s3-bucket YOUR_AWS_BUCKET --output-template-file outputtemplate.yaml

- Creates a CloudFormation Stack, scaffolds out your AWS resources, and deploys your code
aws cloudformation deploy --stack-name YOUR_AWS_BUCKET --template-file outputtemplate.yaml --capabilities CAPABILITY_NAMED_IAM

*/
const AWS = require('aws-sdk') // dev dependency to save space

// DynamoDB will look for your table(s) in the region specified
AWS.config.update({ region: process.env.Region, apiVersion: '2012-08-10' })
// process.env.AWS_SAM_LOCAL returns true if using AWS SAM
if (process.env.AWS_SAM_LOCAL) AWS.config.update({ dynamodb: { endpoint: process.env.DynamoDbEndpoint } })

// Create connection outside of your functions to save
// function process billing time (100 ms increments)
const docClient = new AWS.DynamoDB.DocumentClient()

module.exports.handler = async () => {
    try {
        // DYNAMODB SCANS ARE SLOW - AVOID USING SCANS IN FAVOR OF QUERIES
        const places = await docClient.scan({ TableName: 'places' }).promise()
        return {
            statusCode: 200,
            headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' },
            body: JSON.stringify({ places: places.Items })
        }
    } catch (err) {
        console.error(err)
        return {
            statusCode: 200,
            status: 'error',
            message: err
        }
    }
}