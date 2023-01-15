import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as path from 'path';
import * as iam from 'aws-cdk-lib/aws-iam';
// ES module scope doesn't define __dirname.
import { fileURLToPath } from 'url'
const thisModulesDir = path.dirname(fileURLToPath(import.meta.url));

const accountId = '288507109142';
const region = 'us-east-2';

class LambdaStack extends cdk.Stack {
  /**
   *
   * @param {Construct} scope
   * @param {string} id
   * @param {StackProps=} props
   */
  constructor(scope, id, props) {
    super(scope, id, props);
    console.log(`LambdaStack id: ${id}`);
    // Extract the lambda role from props passed in.

    const lambdaFunction = new lambda.Function(this, 'third', {
      handler: 'index.handler',
      code: lambda.Code.fromAsset(
        path.join(thisModulesDir, '/../../lambda/src/third/')
      ),
      runtime: lambda.Runtime.NODEJS_18_X,
      // Try to pull in existing role?
      role: iam.Role.fromRoleName(this, 'importedRole',
        {roleName: 'RelatableLambdaRole'}
      )
    });

    // TODO: Learn about service roles and why they are necessary.
    const functionUrl = lambdaFunction.addFunctionUrl({
      authType: lambda.FunctionUrlAuthType.NONE
    });
  }
}

export { LambdaStack };
