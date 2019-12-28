aws dynamodb create-table --table-name places \
--endpoint-url http://localhost:8000 \
--attribute-definitions AttributeName=placeKey,AttributeType=S \
--key-schema KeyType=HASH,AttributeName=placeKey \
--provisioned-throughput ReadCapacityUnits=2,WriteCapacityUnits=1