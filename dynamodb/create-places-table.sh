aws dynamodb create-table --table-name places \
--endpoint-url http://localhost:8000 \
--attribute-definitions AttributeName=placeKey,AttributeType=S AttributeName=countryCode,AttributeType=S \
--key-schema KeyType=HASH,AttributeName=placeKey \
--global-secondary-indexes 'IndexName=countryCodeIndex,KeySchema=[{AttributeName=countryCode,KeyType=HASH}],ProvisionedThroughput={ReadCapacityUnits=1,WriteCapacityUnits=1},Projection={ProjectionType=ALL}' \
--provisioned-throughput ReadCapacityUnits=2,WriteCapacityUnits=1