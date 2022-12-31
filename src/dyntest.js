// Run this with AWS_SDK_LOAD_CONFIG=true to pick up the region.
// or...
process.env.AWS_SDK_LOAD_CONFIG = true;

import AWS from 'aws-sdk';

const docClient = new AWS.DynamoDB.DocumentClient({apiVersion: '2012-08-10'});

const handles = [
 {
   'pk': 'user|Ryan Frantz',
   'sk': 'canonical|Ryan Frantz',
   'createdAt': '20221231'
 },
 {
   'pk': 'user|Ryan Frantz',
   'sk': 'github|RyanFrantz',
   'createdAt': '20221231'
 },
 {
   'pk': 'user|Ryan Frantz',
   'sk': 'twitter|Ryan_Frantz',
   'createdAt': '20221231'
 },
 {
   'pk': 'user|Ryan Frantz',
   'sk': 'mastodon|ryan@very.social',
   'createdAt': '20221231'
 },
];

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
      ':user': 'user|Ryan Frantz',
      ':handleType': 'github'
    }
  },
  {
    TableName: 'sandbox-20221229',
    IndexName: 'createdAt-sk-index',
    KeyConditionExpression: 'createdAt = :date',
    ExpressionAttributeValues: {
      ':date': '20221231'
    }
}
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
