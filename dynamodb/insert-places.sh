aws dynamodb put-item --table-name places --item '{ "placeKey": { "S": "1"}, "city": {"S": "San Diego"}, "stateOrProvince": {"S": "CA"}, "countryCode": "{S": "US"} }' --return-consumed-capacity TOTAL --endpoint-url http://localhost:8000
aws dynamodb put-item --table-name places --item '{ "placeKey": { "S": "2"}, "city": {"S": "Phoenix"}, "stateOrProvince": {"S": "AZ"}, "countryCode": "{S": "US"} }' --return-consumed-capacity TOTAL --endpoint-url http://localhost:8000