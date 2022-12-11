const tenants = [
  {
    id: 1,
    name: 'ACME Corp'
  },
  {
    id: 2,
    name: 'Coyotes Unlimited'
  }
];

const resolvers = {
  Query: {
    tenants: () => tenants,
  }
};

export { resolvers };
