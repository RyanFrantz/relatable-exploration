import * as cdk from 'aws-cdk-lib';
import * as iam from 'aws-cdk-lib/aws-iam';

const accountId = '288507109142';
const region = 'us-east-2';
const ALLOW = iam.Effect.ALLOW;

class IamStack extends cdk.Stack {
  /**
   *
   * @param {Construct} scope
   * @param {string} id
   * @param {StackProps=} props
   */
  constructor(scope, id, props) {
    super(scope, id, props);
    console.log(`IamStack id: ${id}`);

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
            `arn:aws:logs:${region}:${accountId}:log-group:/aws/lambda/*:*`
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

    // https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_iam.Role.html
    const lambdaRole = new iam.Role(this, 'RelatableLambdaRole', {
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
      description: 'Role assumed by Relatable Lambda functions',
      roleName: 'RelatableLambdaRole'
    });
    lambdaRole.addManagedPolicy(lambdaExecutionPolicy);
  }
}

export { IamStack };
