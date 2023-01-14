import * as cdk from 'aws-cdk-lib';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as lambda from 'aws-cdk-lib/aws-lambda';

const accountId = '288507109142';
const region = 'us-east-2';
const ALLOW = iam.Effect.ALLOW;

class RelatableStack extends cdk.Stack {
  /**
   *
   * @param {Construct} scope
   * @param {string} id
   * @param {StackProps=} props
   */
  constructor(scope, id, props) {
    super(scope, id, props);
    console.log(`InfraStack id: ${id}`);

    //https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_iam-readme.html
    const lambdaExecutionPolicy = new iam.ManagedPolicy(this, 'RelatableLambdaExecutionPolicy', {
      description: 'Execution policy for Relatable Lambdas',
      statements: [
        new iam.PolicyStatement({
          effect: ALLOW,
          actions: ['logs:CreateLogGroup'],
          resources: [
            `arn:aws:logs:${region}:${accountId}:*`
          ],
        }),
        new iam.PolicyStatement({
          effect: ALLOW,
          actions: [
            'logs:CreateLogStream',
            'logs:PutLogEvents'
          ],
          resources: [
            `arn:aws:logs:${region}:${accountId}:log-group:/aws/lambda/first:*`
          ],
        }),
        new iam.PolicyStatement({
          effect: ALLOW,
          actions: ['dynamodb:Query'],
          resources: [
            `arn:aws:dynamodb:${region}:${accountId}:table/sandbox-20221229`
          ],
        })
      ]
    });

    const lambdaFunction = new lambda.Function(this, 'second', {
      handler: 'index.mjs.handler',
      code: lambda.Code.fromInline(`
        export const handler = async(event) => {
          console.log('Event: ', event);
          return 'My second Lambda!'
        };
      `),
      runtime: lambda.Runtime.NODEJS_18_X
    });

    // TODO: Learn about service roles and why they are necessary.
    const functionUrl = lambdaFunction.addFunctionUrl({
      authType: lambda.FunctionUrlAuthType.NONE
    });

    //https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_dynamodb-readme.html
    // TODO: Add auto-scaling, like the sandbox table.
    const relatableTable = new dynamodb.Table(this, 'relatable', {
      billingMode: dynamodb.BillingMode.PROVISIONED,
      readCapacity: 1,
      writeCapacity: 1,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      partitionKey: {name: 'pk', type: dynamodb.AttributeType.STRING},
      sortKey: {name: 'sk', type: dynamodb.AttributeType.STRING},
      //pointInTimeRecovery: true, // Continuous backups, when we're ready.
    });

    // Index of reversed keys to support many-to-many lookups.
    relatableTable.addGlobalSecondaryIndex({
      indexName: 'sk-pk-index',
      partitionKey: {name: 'sk', type: dynamodb.AttributeType.STRING},
      sortKey: {name: 'pk', type: dynamodb.AttributeType.STRING},
      // Project all keys into the index.
      projectionType: dynamodb.ProjectionType.ALL
    });

    // Index of createAt timestamp to time-based lookups.
    relatableTable.addGlobalSecondaryIndex({
      indexName: 'createdAt-sk-index',
      partitionKey: {name: 'createdAt', type: dynamodb.AttributeType.STRING},
      sortKey: {name: 'sk', type: dynamodb.AttributeType.STRING},
      // Project all keys into the index.
      projectionType: dynamodb.ProjectionType.ALL
    });
  }
}

export { RelatableStack };
