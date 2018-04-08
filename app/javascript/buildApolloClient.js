import ApolloClient from 'apollo-client';
import { ApolloLink } from 'apollo-link';
import { createUploadLink } from 'apollo-upload-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import fetch from 'unfetch';

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
      createUploadLink({ uri: '/graphql', fetch }),
    ]),
    cache: new InMemoryCache(),
  });
}

export default buildApolloClient;
