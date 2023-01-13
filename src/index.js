import { ApolloServer } from 'apollo-server';
import { ApolloServerPluginLandingPageLocalDefault } from 'apollo-server-core';
import { typeDefs } from './schema.js';
import { resolvers } from './resolvers.js';
import { MyLambda } from './datasources/lambda.js';

const server = new ApolloServer({
  typeDefs,
  resolvers,
  dataSources: () => {
    return {
      MyLambda: new MyLambda(),
    };
  },
  csrfPrevention: true,
  plugins: [
    // Recommended in https://www.apollographql.com/docs/apollo-server/getting-started/
    ApolloServerPluginLandingPageLocalDefault({ embed: true }),
  ]
});

server.listen().then(({url}) => {
  console.log(`🚀  Server ready at ${url}`);
});
