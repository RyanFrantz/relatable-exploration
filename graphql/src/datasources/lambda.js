//import { RESTDataSource } from '@apollo/datasource-rest'; // Apollo v4
import { RESTDataSource } from 'apollo-datasource-rest'; // Apollo v3 (us)

class MyLambda extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = 'https://7dsgyi7ncu7tn6gzrzzgiobzoq0pykmb.lambda-url.us-east-2.on.aws/';
  }

  async getFakeUser() {
    //return this.get('https://7dsgyi7ncu7tn6gzrzzgiobzoq0pykmb.lambda-url.us-east-2.on.aws/');
    const response = await this.get('');
    console.log(response.Items);
    return response.Items[0];
  }
}

export { MyLambda };
