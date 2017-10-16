import { ApolloClient, createNetworkInterface } from 'react-apollo';

function buildApolloClient(authenticityToken) {
  return new ApolloClient({
    networkInterface: createNetworkInterface({
      uri: '/graphql',
      opts: {
        credentials: 'same-origin',
        headers: {
          'X-CSRF-Token': authenticityToken,
        },
      },
    }),
  });
}

export default buildApolloClient;
