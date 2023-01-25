// v3 SDK
import { DynamoDBDocumentClient, QueryCommand } from "@aws-sdk/lib-dynamodb";
// Create service client module using ES6 syntax.
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
// Create an Amazon DynamoDB service client object.
const ddbClient = new DynamoDBClient({ region: "us-east-2" });

const docClient = DynamoDBDocumentClient.from(ddbClient);

const queryParams = {
    TableName: 'sandbox-20221229',
    //KeyConditionExpression: 'pk = :user and begins_with (sk, :handleType)',
    KeyConditionExpression: 'pk = :user',
    ExpressionAttributeValues: {
      ':user': 'user|Chuck Norris',
    //':handleType': 'github'
    }
};

const handlePrefix = /\w+\|/; // We'll strip this from the fetched handles

export const handler = async(event) => {
  console.log('Event: ', event)
  let result;
  try {
    console.log('Query Params:', queryParams)
    result = await docClient.send(new QueryCommand(queryParams));
    console.log(result.Items);
  } catch (err) {
    console.log("Error", err);
  }
    const handles = result.Items.map((item) => {
      let cleanHandle = {
        user: item.pk.replace(handlePrefix, ''),
        handle: item.sk.replace(handlePrefix, ''),
        handleType: item.handleType
      };
      if (item.employmentStatus) {
        cleanHandle.employmentStatus = item.employmentStatus
      }
      return cleanHandle;
    });
    //console.log('New object: ', handles)
    return handles;
};
