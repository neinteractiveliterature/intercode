import ApolloClient from 'apollo-client';
import { ApolloLink } from 'apollo-link';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';

function buildApolloClient(authenticityToken) {
  const AuthLink = (operation, next) => {
    operation.setContext(context => ({
      ...context,
      credentials: 'same-origin',
      headers: {
        ...context.headers,
        'X-CSRF-Token': authenticityToken,
      },
    }));

    return next(operation);
  };

  return new ApolloClient({
    link: ApolloLink.from([
      AuthLink,
      new HttpLink({ uri: '/graphql' }),
    ]),
    cache: new InMemoryCache(),
  });
}

export default buildApolloClient;
