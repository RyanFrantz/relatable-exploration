// Run this with AWS_SDK_LOAD_CONFIG=true to pick up the region.
// or...
process.env.AWS_SDK_LOAD_CONFIG = true;

import AWS from 'aws-sdk';

const docClient = new AWS.DynamoDB.DocumentClient({apiVersion: '2012-08-10'});

import { handles } from './mockedHandles.js';

let params = {
  TableName: 'sandbox-20221229',
};

try {
  for (const h of handles) {
    params.Item = h;
    await docClient.put(params).promise();
    console.log('Successfully added item!');
  };
} catch (err) {
  console.log('Error ', err);
}

/* If an attribute name matches a reserved word (like 'user') or includes
 * a special character like '.' or '-', we have to use expression attribute
 * names and values to create our query!
 */
const queryParams = [
  {
    TableName: 'sandbox-20221229',
    KeyConditionExpression: 'pk = :user and begins_with (sk, :handleType)',
    ExpressionAttributeValues: {
      ':user': 'user|Chuck Norris',
      ':handleType': 'github'
    }
  },
]

try {
  for (const params of queryParams) {
    console.log('Query Params:', params)
    const items = await docClient.query(params).promise();
    console.log(items);
  }
} catch (err) {
  console.log("Error", err);
}
