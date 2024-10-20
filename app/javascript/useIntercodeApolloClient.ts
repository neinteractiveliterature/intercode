import { useMemo } from 'react';
import {
  ApolloClient,
  ApolloLink,
  Operation,
  NextLink,
  InMemoryCache,
  NormalizedCacheObject,
  split,
} from '@apollo/client';
import { BatchHttpLink } from '@apollo/client/link/batch-http';
import createUploadLink from 'apollo-upload-client/createUploadLink.mjs';
import { DateTime } from 'luxon';
import { onError } from '@apollo/client/link/error/index.js';

import possibleTypes from './possibleTypes.json';
import AuthenticityTokensManager from './AuthenticityTokensContext';
import { GraphQLFormattedError } from 'graphql';

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

const AddTimezoneLink = new ApolloLink((operation: Operation, next: NextLink) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  operation.setContext((context: Record<string, any>) => ({
    ...context,
    headers: {
      ...context.headers,
      ...getIntercodeUserTimezoneHeader(),
    },
  }));

  return next(operation);
});

export class GraphQLNotAuthenticatedErrorEvent extends Event {
  static type = 'graphqlNotAuthenticatedError';
  error: GraphQLFormattedError;

  constructor(error: GraphQLFormattedError) {
    super(GraphQLNotAuthenticatedErrorEvent.type);
    this.error = error;
  }
}

export const ErrorHandlerLink: ApolloLink = onError(({ graphQLErrors }) => {
  if (graphQLErrors) {
    for (const error of graphQLErrors) {
      if (error.extensions?.code === 'NOT_AUTHENTICATED') {
        window.dispatchEvent(new GraphQLNotAuthenticatedErrorEvent(error));
      }
    }
  }
});

export function getIntercodeUserTimezoneHeader() {
  const localTime = DateTime.local();
  return { 'X-Intercode-User-Timezone': localTime.zoneName ?? '' };
}

export const AuthHeadersLink = new ApolloLink((operation: Operation, next: NextLink) => {
  operation.setContext((context: ReturnType<Operation['getContext']>) => ({
    ...context,
    credentials: 'same-origin',
    headers: {
      ...context.headers,
      'X-CSRF-Token': AuthenticityTokensManager.instance.tokens.graphql,
    },
  }));

  return next(operation);
});

export function buildTerminatingApolloLink(options: BatchHttpLink.Options): ApolloLink {
  // adapted from https://github.com/jaydenseric/apollo-upload-client/issues/63#issuecomment-392501449
  return split(isUpload, createUploadLink(options), new BatchHttpLink(options));
}

export function buildIntercodeApolloLink(uri: URL): ApolloLink {
  return ApolloLink.from([
    AuthHeadersLink,
    AddTimezoneLink,
    ErrorHandlerLink,
    buildTerminatingApolloLink({
      uri: uri.toString(),
      fetch,
    }),
  ]);
}

export function useIntercodeApolloLink(uri: URL): ApolloLink {
  const link = useMemo(() => buildIntercodeApolloLink(uri), [uri]);

  return link;
}

export function buildIntercodeApolloClient(
  link: ApolloLink,
  options?: { ssrMode?: boolean },
): ApolloClient<NormalizedCacheObject> {
  return new ApolloClient({
    link,
    ssrMode: options?.ssrMode,
    cache: new InMemoryCache({
      addTypename: true,
      possibleTypes,
      typePolicies: {
        Ability: {
          merge: true,
        },
        AuthorizedApplication: {
          keyFields: ['uid'],
        },
        ConventionReports: {
          merge: true,
        },
        Event: {
          fields: {
            rooms: { merge: true },
            room_names: { merge: true },
          },
        },
        RegistrationPolicy: {
          merge: (existing, incoming) => incoming,
        },
      },
    }),
  });
}

export function getClientURL(): URL {
  if (typeof window !== 'undefined') {
    return new URL('/graphql', window.location.href);
  } else {
    return new URL('/graphql', process.env.INTERCODE_BACKEND);
  }
}

export function buildBrowserApolloClient() {
  return buildIntercodeApolloClient(buildIntercodeApolloLink(getClientURL()));
}
