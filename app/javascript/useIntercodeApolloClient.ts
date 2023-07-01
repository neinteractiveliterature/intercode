import { useMemo, RefObject } from 'react';
import {
  ApolloClient,
  ApolloLink,
  Operation,
  NextLink,
  InMemoryCache,
  NormalizedCacheObject,
  split,
  DataProxy,
  DocumentNode,
} from '@apollo/client';
import { BatchHttpLink } from '@apollo/client/link/batch-http';
import { useAuthHeadersLink, useErrorHandlerLink } from '@neinteractiveliterature/litform';
import { createUploadLink } from 'apollo-upload-client';
import { DateTime } from 'luxon';

import possibleTypes from './possibleTypes.json';

// adapted from https://github.com/jaydenseric/apollo-upload-client/issues/63#issuecomment-392501449
function isFile(value: unknown): value is Blob | File {
  return (
    (typeof File !== 'undefined' && value instanceof File) || (typeof Blob !== 'undefined' && value instanceof Blob)
  );
}

function isUpload({ variables }: Operation) {
  return Object.values(variables).some(isFile);
}

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

  // adapted from https://github.com/jaydenseric/apollo-upload-client/issues/63#issuecomment-392501449
  const TerminatingLink = split(
    isUpload,
    createUploadLink({ uri: '/graphql', fetch }),
    new BatchHttpLink({
      uri: '/graphql',
      fetch,
    }),
  );

  const link = useMemo(
    () => ApolloLink.from([AuthLink, AddTimezoneLink, ErrorHandlerLink, TerminatingLink]),
    [AuthLink, AddTimezoneLink, ErrorHandlerLink, TerminatingLink],
  );

  return link;
}

function useIntercodeApolloClient(
  authenticityToken: string,
  onUnauthenticatedRef: RefObject<() => void>,
  queryData?: DataProxy.WriteQueryOptions<unknown, unknown>[],
): ApolloClient<NormalizedCacheObject> {
  const link = useIntercodeApolloLink(authenticityToken, onUnauthenticatedRef);

  const client = useMemo(() => {
    const client = new ApolloClient({
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
    });

    if (queryData) {
      for (const query of queryData) {
        client.writeQuery(query);
      }
    }

    return client;
  }, [link]);

  return client;
}

export default useIntercodeApolloClient;
