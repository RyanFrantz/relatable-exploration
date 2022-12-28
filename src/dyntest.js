// Run this with AWS_SDK_LOAD_CONFIG=true to pick up the region.
import AWS from 'aws-sdk';

const docClient = new AWS.DynamoDB.DocumentClient({apiVersion: '2012-08-10'});

/*
const params = {
  TableName: 'sandbox',
  Item: {
    'user': 'ryan',
    'profile': 'my new details',
    'new-attr': 'is this set?'
  }
};

docClient.put(params, function(err, data) {
  if (err) {
    console.log("Error", err);
  } else {
    console.log("Success", data);
  }
});
*/

/*
const params = {
  TableName: 'sandbox',
  // We have defined a partition key and a sort key in the table so we
  // need to specify both in the Key in order for this to be retrieved.
  Key: {
    'user': 'ryan',
    'profile': 'my details'
  }
}
*/


/*
try {
  const item = await docClient.get(params).promise();
  console.log(item);
} catch (err) {
  console.log("Error", err);
}
*/

/* If an attribute name matches a reserved word (like 'user') or includes
 * a special character like '.' or '-', we have to use expression attribute
 * names and values to create our query!
 */
const queryParams = {
  TableName: 'sandbox',
  KeyConditionExpression: '#u = :user',
  ExpressionAttributeNames: {
    '#u': 'user'
  },
  ExpressionAttributeValues: {
    ':user': 'ryan'
  }
}

try {
  const items = await docClient.query(queryParams).promise();
  console.log(items);
} catch (err) {
  console.log("Error", err);
}
