import { useMemo, RefObject } from 'react';
import { ApolloClient, ApolloLink, Operation, NextLink, InMemoryCache, NormalizedCacheObject } from '@apollo/client';
import { useAuthHeadersLink, useErrorHandlerLink } from '@neinteractiveliterature/litform';
import { createUploadLink } from 'apollo-upload-client';
import { DateTime } from 'luxon';

import possibleTypes from './possibleTypes.json';

export function useIntercodeApolloLink(
  authenticityToken: string,
  onUnauthenticatedRef?: RefObject<() => void>,
): ApolloLink {
  const AuthLink = useAuthHeadersLink(authenticityToken);

  const AddTimezoneLink = useMemo(
    () =>
      new ApolloLink((operation: Operation, next: NextLink) => {
        const localTime = DateTime.local();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

  const ErrorHandlerLink = useErrorHandlerLink(onUnauthenticatedRef);

  const link = useMemo(
    () => ApolloLink.from([AuthLink, AddTimezoneLink, ErrorHandlerLink, createUploadLink({ uri: '/graphql', fetch })]),
    [AuthLink, AddTimezoneLink, ErrorHandlerLink],
  );

  return link;
}

function useIntercodeApolloClient(
  authenticityToken: string,
  onUnauthenticatedRef: RefObject<() => void>,
): ApolloClient<NormalizedCacheObject> {
  const link = useIntercodeApolloLink(authenticityToken, onUnauthenticatedRef);

  const client = useMemo(
    () =>
      new ApolloClient({
        link,
        cache: new InMemoryCache({
          addTypename: true,
          possibleTypes,
          typePolicies: {
            Convention: {
              fields: {
                reports: {
                  merge: (existing, incoming) => ({ ...existing, ...incoming }),
                },
              },
            },
            Event: {
              fields: {
                registrationPolicy: {
                  merge: (existing, incoming) => incoming,
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
            UserConProfile: {
              fields: {
                ability: {
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

export default useIntercodeApolloClient;
