import { gql } from 'apollo-server';

const typeDefs = gql`
  type Tenant {
    name: String!
  }

  type Query {
    """
    Simple PoC.
    """
    tenants: [Tenant]

  }
`;

export { typeDefs };
