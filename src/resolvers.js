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
      let tenant = tenants.find((t) => t.id == args.id);
      // Naive example of a lookahead query.
      tenant.location = locations.find((l) => l.id == tenant.id);
      return tenant;
    },
    fakeuser: (_, __, {dataSources}) => {
      return dataSources.MyLambda.getFakeUser();
    }
  },
  Tenant: {
    location: (parent, args, contextValue, info) => {
      console.log(JSON.stringify(parent));
      //console.log(JSON.stringify(args));
      //console.log(JSON.stringify(contextValue));
      //console.log(JSON.stringify(info, null, 2));
      if (parent?.location) {
        console.log('Location resolved via lookahead query!');
        return parent.location;
      } else {
        return locations.find((l) => l.id == parent.id);
      }
    },
  }
};

export { resolvers };
