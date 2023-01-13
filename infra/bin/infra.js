#!/usr/bin/env node

import cdk from 'aws-cdk-lib';
import { InfraStack } from '../lib/infra-stack.js';

const app = new cdk.App();
new InfraStack(app, 'InfraStack', {
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
