# AWS SAM CRUD App 

## This project is for educational purposes
#### Implements AWS S3, API Gateway, Lambda functions, and DynamoDB.

Run AWS SAM [AWS SAM](https://aws.amazon.com/serverless/sam/) locally implementing API Gateway, Lambda, and DynamoDB.  

You need AWS SAM running locally to use this source code, reference this tutorial to get started with AWS SAM:  
[Tutorial on getting AWS SAM running locally](https://github.com/aaronwht/aws-sam-dynamodb-local).  

## To run project locally
Begin by ensuring DynamoDB is running locally using the following command:  
`docker run -p 8000:8000 -v $(pwd)/local/dynamodb:/data/ amazon/dynamodblocal -jar DynamoDBLocal.jar -sharedDb -dbPath /data` . 

Next, start SAM by running `sam local start-api --port 3030`  
You may skip checking for updated Docker containers by adding the `--skip-pull-image` flag as specified below:  
`sam local start-api --port 3030 --skip-pull-image`  

To deploy to AWS you may run:  
`aws cloudformation package --template-file template.yaml --s3-bucket YOUR_AWS_BUCKET --output-template-file outputtemplate.yaml`

Then:  
`aws cloudformation deploy --stack-name YOUR_AWS_BUCKET --template-file outputtemplate.yaml --capabilities CAPABILITY_NAMED_IAM`  

This project has a [companion client-side project](https://github.com/aaronwht/aws-sam-client) for UI interactions.



If this helped you consider making a donation to support me at [Patreon](https://www.patreon.com/aaronwht)
