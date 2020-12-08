import { ApolloClient, gql, InMemoryCache } from '@apollo/client';


// const typeDefs = gql``

export const client = new ApolloClient({
  uri: 'http://bvd_jss_test.dev.local/api/bvd_jss_test?sc_apikey={97EFF444-65BF-4783-8B97-2965C3EA72F6}',
  cache: new InMemoryCache(),
  // typeDefs
});

// client
//   .query({
//     query: gql`
//       query GetRates {
//         rates(currency: "USD") {
//           currency
//         }
//       }
//     `
//   })
//   .then(result => console.log(result));