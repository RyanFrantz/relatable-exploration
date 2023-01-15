#!/usr/bin/env node

import cdk from 'aws-cdk-lib';
import { IamStack } from '../lib/iam-stack.js';
import { LambdaStack } from '../lib/lambda-stack.js';
import { DynamoStack } from '../lib/dynamo-stack.js';

const app = new cdk.App();
new IamStack(app, 'IamStack', {
  /* NOTE: Not all resources will receive this tag, since not all resources
   * support tags.
   * Ex. IAM Managed policies will not be tagged.*/
  tags: {
    Product: 'Relatable'
  }
  /* If you don't specify 'env', this stack will be environment-agnostic.
   * Account/Region-dependent features and context lookups will not work,
   * but a single synthesized template can be deployed anywhere. */
  /* For more information, see https://docs.aws.amazon.com/cdk/latest/guide/environments.html */
});

new LambdaStack(app, 'LambdaStack', {
  lambdaRole: IamStack.lambdaRole,
  tags: {
    Product: 'Relatable'
  }
});

new DynamoStack(app, 'DynamoStack', {
  tags: {
    Product: 'Relatable'
  }
});
