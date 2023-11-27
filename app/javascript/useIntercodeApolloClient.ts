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

function containsFile(obj: object, seen: Set<object>): boolean {
  return Object.values(obj).some((value) => {
    if (isFile(value)) {
      return true;
    }

    if (typeof value === 'object' && value != null && !seen.has(value)) {
      seen.add(value);
      return containsFile(value, seen);
    }

    return false;
  });
}

function isUpload({ variables }: Operation) {
  return containsFile(variables, new Set([variables]));
}

export function getIntercodeUserTimezoneHeader() {
  const localTime = DateTime.local();
  return { 'X-Intercode-User-Timezone': localTime.zoneName ?? '' };
}

export function useIntercodeApolloLink(
  authenticityToken: string,
  onUnauthenticatedRef?: RefObject<() => void>,
): ApolloLink {
  const AuthLink = useAuthHeadersLink(authenticityToken);

  const AddTimezoneLink = useMemo(
    () =>
      new ApolloLink((operation: Operation, next: NextLink) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        operation.setContext((context: Record<string, any>) => ({
          ...context,
          headers: {
            ...context.headers,
            ...getIntercodeUserTimezoneHeader(),
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
          Ability: {
            merge: true,
          },
          ConventionReports: {
            merge: true,
          },
          RegistrationPolicy: {
            merge: (existing, incoming) => incoming,
          },
        },
      }),
    });

    if (queryData && Array.isArray(queryData)) {
      for (const query of queryData) {
        client.writeQuery(query);
      }
    }

    return client;
  }, [link, queryData]);

  return client;
}

export default useIntercodeApolloClient;
