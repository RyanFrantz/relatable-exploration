import { gql } from 'apollo-server';

const typeDefs = gql`
  type Location {
    id: Int!
    city: String!
    state: String!
  }

  type Tenant {
    name: String!
    location: Location
  }

  type Query {
    """
    Simple PoC.
    """
    tenants: [Tenant],
    tenant(id: Int!): Tenant
    fakeuser: FakeUser
  }

  type FakeUser {
    createdAt: String,
    pk: String,
    sk: String
  }
`;

export { typeDefs };
