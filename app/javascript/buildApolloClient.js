import ApolloClient from 'apollo-client';
import { ApolloLink } from 'apollo-link';
import { onError } from 'apollo-link-error';
import { createUploadLink } from 'apollo-upload-client';
import { InMemoryCache, IntrospectionFragmentMatcher } from 'apollo-cache-inmemory';
import fetch from 'unfetch';

import introspectionQueryResultData from './fragmentTypes.json';

const fragmentMatcher = new IntrospectionFragmentMatcher({ introspectionQueryResultData });

function buildErrorHandlerLink(onUnauthenticated) {
  return onError(({ graphQLErrors }) => {
    if (graphQLErrors) {
      if (graphQLErrors.some(err => (err.extensions || {}).code === 'NOT_AUTHENTICATED')) {
        onUnauthenticated();
      }
    }
  });
}

function buildApolloClient(authenticityToken, onUnauthenticated) {
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
      buildErrorHandlerLink(onUnauthenticated),
      createUploadLink({ uri: '/graphql', fetch }),
    ]),
    cache: new InMemoryCache({
      addTypename: true,
      fragmentMatcher,
    }),
  });
}

export default buildApolloClient;
