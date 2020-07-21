import {
  useRef, useMemo, useEffect, RefObject,
} from 'react';
import { ApolloClient } from 'apollo-client';
import { ApolloLink, Operation, NextLink } from 'apollo-link';
import { onError } from 'apollo-link-error';
import { createUploadLink } from 'apollo-upload-client';
import { InMemoryCache, IntrospectionFragmentMatcher } from 'apollo-cache-inmemory';
import fetch from 'unfetch';
import { DateTime } from 'luxon';

import introspectionQueryResultData from './fragmentTypes.json';

const fragmentMatcher = new IntrospectionFragmentMatcher({ introspectionQueryResultData });

export function useIntercodeApolloLink(
  authenticityToken: string, onUnauthenticatedRef: RefObject<() => void>,
) {
  const authenticityTokenRef = useRef(authenticityToken);
  useEffect(
    () => { authenticityTokenRef.current = authenticityToken; },
    [authenticityToken],
  );

  const AuthLink = useMemo(
    () => new ApolloLink((operation: Operation, next: NextLink) => {
      operation.setContext((context: Record<string, any>) => ({
        ...context,
        credentials: 'same-origin',
        headers: {
          ...context.headers,
          'X-CSRF-Token': authenticityTokenRef.current,
        },
      }));

      return next(operation);
    }),
    [],
  );

  const AddTimezoneLink = useMemo(
    () => new ApolloLink((operation: Operation, next: NextLink) => {
      const localTime = DateTime.local();
      operation.setContext((context: Record<string, any>) => ({
        ...context,
        headers: {
          ...context.headers,
          'X-Intercode-User-Timezone': localTime.zoneName,
        },
      }));

      return next(operation);
    }),
    [],
  );

  const ErrorHandlerLink = useMemo(
    () => onError(({ graphQLErrors }) => {
      if (graphQLErrors) {
        if (graphQLErrors.some((err) => (err.extensions || {}).code === 'NOT_AUTHENTICATED')) {
          if (onUnauthenticatedRef?.current) {
            onUnauthenticatedRef.current();
          }
        }
      }
    }),
    [onUnauthenticatedRef],
  );

  const link = useMemo(
    () => ApolloLink.from([
      AuthLink,
      AddTimezoneLink,
      ErrorHandlerLink,
      createUploadLink({ uri: '/graphql', fetch }),
    ]),
    [AuthLink, AddTimezoneLink, ErrorHandlerLink],
  );

  return link;
}

function useIntercodeApolloClient(
  authenticityToken: string, onUnauthenticatedRef: RefObject<() => void>,
) {
  const link = useIntercodeApolloLink(authenticityToken, onUnauthenticatedRef);

  const client = useMemo(
    () => new ApolloClient({
      link,
      cache: new InMemoryCache({
        addTypename: true,
        fragmentMatcher,
      }),
    }),
    [link],
  );

  return client;
}

export default useIntercodeApolloClient;
