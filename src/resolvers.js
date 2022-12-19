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

const locations = [
  {
    id: 1,
    city: 'Albuquerque',
    state: 'NM'
  },
  {
    id: 2,
    city: 'Death Valley',
    state: 'CA'
  }
];

const resolvers = {
  Query: {
    tenants: () => tenants,
    tenant: (parent, args, contextValue, info) => {
      //console.log(JSON.stringify(parent)); // undefined because rootQuery
      //console.log(JSON.stringify(args));
      //console.log(JSON.stringify(contextValue));
      //console.log(JSON.stringify(info, null, 2));
      return tenants.find((u) => u.id == args.id);
    },
  },
  Tenant: {
    location: (parent, args, contextValue, info) => {
      console.log(JSON.stringify(parent));
      //console.log(JSON.stringify(args));
      //console.log(JSON.stringify(contextValue));
      //console.log(JSON.stringify(info, null, 2));
      return locations.find((l) => l.id == parent.id);
    },
  }
};

export { resolvers };
