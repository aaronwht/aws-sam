# I recommend [AWS ECS](https://github.com/aaronwht/aws-ecs-typescript) for RESTful API services.

### [AWS SAM](https://aws.amazon.com/serverless/sam/) CRUD App implements S3 picture upload, API Gateway routing, Lambda functions, and a DynamoDB table - locally and easily deploy to AWS.

If you need help getting AWS SAM to run locally you may reference [this tutorial](https://github.com/aaronwht/aws-sam-dynamodb-local).

Please [contact me](https://www.aaronwht.com/) if you run into issues with this source code or these instructions.

###### You will need to AWS SAM running locally, along with with DynamoDB, to run this code locally.

This project has a [companion client-side project](https://github.com/aaronwht/aws-sam-client) for UI interactions.

## Run AWS SAM Locally

Begin by ensuring DynamoDB is running locally using the following command:  
`docker run -p 8000:8000 -v $(pwd)/local/dynamodb:/data/ amazon/dynamodblocal -jar DynamoDBLocal.jar -sharedDb -dbPath /data` .

#### SAM does not create the 'places' DynamoDB table locally

The `template.yaml` file includes CloudFormation instructions to create a `places` table, however, AWS SAM does not create this for you locally. To create the DynamoDB table locally, run the below command:  
`aws dynamodb create-table --table-name places --endpoint-url http://localhost:8000 --attribute-definitions AttributeName=placeKey,AttributeType=S --key-schema KeyType=HASH,AttributeName=placeKey --provisioned-throughput ReadCapacityUnits=2,WriteCapacityUnits=1`

CloudFormation will create the `places` table when deploying to AWS using the `template.yaml` file.

Start AWS SAM by running `sam local start-api --port 3030`.  
This command ensures you have the most updated Docker containers and will download them if you don't. This can increase the time required to run your application. After you run that command initially, you may stop it by running `Control + C` multiple times.

To skip checking for updated Docker containers and speed up local development add the `--skip-pull-image` flag as specified below:  
`sam local start-api --port 3030 --skip-pull-image`

To deploy this application to AWS, CloudFormation will package the source code and upload it to an S3 bucket you specify.

Replace `YOUR_AWS_BUCKET` in the below syntax with your S3 bucket name and then run the below command:  
`aws cloudformation package --template-file template.yaml --s3-bucket YOUR_AWS_BUCKET --output-template-file outputtemplate.yaml`

Once the source code has been successfully packaged and uploaded to S3 you may deploy the application by specifying a stack name. [A stack name must be unique in the region in which you are creating the stack and may only contain alphanumeric characters and hyphens](https://docs.aws.amazon.com/cli/latest/reference/cloudformation/create-stack.html).

Replace `YOUR_STACK_NAME` in the below syntax with your desired stack name:  
`aws cloudformation deploy --stack-name YOUR_STACK_NAME --template-file outputtemplate.yaml --capabilities CAPABILITY_NAMED_IAM`

#### Code Pipeline

Automated deployments - you may use this source code with AWS Code Pipeline to automate deployments as it includes a `buildspec.yaml` file which creates/updates the CloudFormation stack during the build phase of the pipeline process. You will not need a deploy stage for your pipeline.
