import { useRef, useMemo, useEffect, RefObject } from 'react';
import {
  ApolloClient,
  ApolloLink,
  Operation,
  NextLink,
  InMemoryCache,
  createHttpLink,
} from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import { createUploadLink } from 'apollo-upload-client';
import { DateTime } from 'luxon';

import possibleTypes from './possibleTypes.json';

export function useIntercodeApolloLink(
  authenticityToken: string,
  onUnauthenticatedRef?: RefObject<() => void>,
) {
  const authenticityTokenRef = useRef(authenticityToken);
  useEffect(() => {
    authenticityTokenRef.current = authenticityToken;
  }, [authenticityToken]);

  const AuthLink = useMemo(
    () =>
      new ApolloLink((operation: Operation, next: NextLink) => {
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
    () =>
      new ApolloLink((operation: Operation, next: NextLink) => {
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
    () =>
      onError(({ graphQLErrors }) => {
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
    () =>
      ApolloLink.from([
        AuthLink,
        AddTimezoneLink,
        ErrorHandlerLink,
        // @ts-ignore because @types/apollo-upload-client hasn't been updated for 14.x.x
        createUploadLink({ uri: '/graphql', fetch }),
      ]),
    [AuthLink, AddTimezoneLink, ErrorHandlerLink],
  );

  return link;
}

function useIntercodeApolloClient(
  authenticityToken: string,
  onUnauthenticatedRef: RefObject<() => void>,
) {
  const link = useIntercodeApolloLink(authenticityToken, onUnauthenticatedRef);

  const client = useMemo(
    () =>
      new ApolloClient({
        link,
        cache: new InMemoryCache({
          addTypename: true,
          possibleTypes,
          typePolicies: {
            UserConProfile: {
              fields: {
                ability: {
                  merge: (existing, incoming) => ({ ...existing, ...incoming }),
                },
              },
            },
            Query: {
              fields: {
                currentAbility: {
                  merge: (existing, incoming) => ({ ...existing, ...incoming }),
                },
              },
            },
          },
        }),
      }),
    [link],
  );

  return client;
}

export function useSsrApolloClient(request?: { header: (name: string) => string }) {
  const client = useMemo(
    () =>
      new ApolloClient({
        ssrMode: true,
        link: createHttpLink({
          uri: 'https://localhost:5000',
          credentials: 'same-origin',
          headers: {
            cookie: request?.header('Cookie'),
          },
        }),
        cache: new InMemoryCache(),
      }),
    [request],
  );

  return client;
}

export default useIntercodeApolloClient;
