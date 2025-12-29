import { useMemo } from 'react';
import { ApolloClient, ApolloLink, CombinedGraphQLErrors, InMemoryCache } from '@apollo/client';
import { BatchHttpLink } from '@apollo/client/link/batch-http';
import UploadHttpLink from 'apollo-upload-client/UploadHttpLink.mjs';
import { DateTime } from 'luxon';
import { ErrorLink } from '@apollo/client/link/error';
import { SetContextLink } from '@apollo/client/link/context';

import possibleTypes from './possibleTypes.json';
import AuthenticityTokensManager from './AuthenticityTokensContext';
import { GraphQLFormattedError } from 'graphql';
import { getBackendBaseUrl } from './getBackendBaseUrl';
import { AuthenticationManager } from './Authentication/authenticationManager';

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

function isUpload({ variables }: ApolloLink.Operation) {
  return containsFile(variables, new Set([variables]));
}

const AddHeadersLink = new ApolloLink((operation: ApolloLink.Operation, next: ApolloLink.ForwardFunction) => {
  const intercodeConventionHeaders: { 'X-Intercode-Convention-Domain'?: string } = {};
  if (typeof window !== 'undefined') {
    intercodeConventionHeaders['X-Intercode-Convention-Domain'] = window.location.hostname;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  operation.setContext((context: Record<string, any>) => ({
    ...context,
    headers: {
      ...context.headers,
      ...intercodeConventionHeaders,
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

export const ErrorHandlerLink: ApolloLink = new ErrorLink(({ error }) => {
  if (CombinedGraphQLErrors.is(error)) {
    for (const err of error.errors) {
      if (err.extensions?.code === 'NOT_AUTHENTICATED') {
        window.dispatchEvent(new GraphQLNotAuthenticatedErrorEvent(err));
      }
    }
  }
});

export function getIntercodeUserTimezoneHeader() {
  const localTime = DateTime.local();
  return { 'X-Intercode-User-Timezone': localTime.zoneName ?? '' };
}

export function buildAuthHeadersLink(
  authenticityTokensManager: AuthenticityTokensManager,
  authenticationManager: AuthenticationManager,
) {
  return new SetContextLink((prevContext) => {
    const token = authenticationManager.jwtToken;
    const authHeaders: { Authorization?: string } = {};

    if (token) {
      authHeaders.Authorization = `Bearer ${token}`;
    }

    return {
      ...prevContext,
      credentials: 'same-origin',
      headers: {
        ...prevContext.headers,
        'X-CSRF-Token': authenticityTokensManager.tokens?.graphql,
        ...authHeaders,
      },
    };
  });
}

export function buildTerminatingApolloLink(options: BatchHttpLink.Options): ApolloLink {
  // adapted from https://github.com/jaydenseric/apollo-upload-client/issues/63#issuecomment-392501449
  return ApolloLink.split(isUpload, new UploadHttpLink(options), new BatchHttpLink(options));
}

export function buildClientApolloLink(
  uri: URL,
  authenticityTokensManager: AuthenticityTokensManager,
  authenticationManager: AuthenticationManager,
): ApolloLink {
  return ApolloLink.from([
    buildAuthHeadersLink(authenticityTokensManager, authenticationManager),
    AddHeadersLink,
    ErrorHandlerLink,
    buildTerminatingApolloLink({
      uri: uri.toString(),
      fetch,
    }),
  ]);
}

export function useIntercodeApolloLink(
  uri: URL,
  authenticityTokensManager: AuthenticityTokensManager,
  authenticationManager: AuthenticationManager,
): ApolloLink {
  const link = useMemo(
    () => buildClientApolloLink(uri, authenticityTokensManager, authenticationManager),
    [uri, authenticityTokensManager, authenticationManager],
  );

  return link;
}

export function buildIntercodeApolloCache(): InMemoryCache {
  return new InMemoryCache({
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
  });
}

export function buildIntercodeApolloClient(
  link: ApolloLink,
  options?: { ssrMode?: boolean; cache?: InMemoryCache },
): ApolloClient {
  return new ApolloClient({
    link,
    ssrMode: options?.ssrMode,
    cache: options?.cache ?? buildIntercodeApolloCache(),
  });
}

export function getClientURL(): URL {
  return new URL('/graphql', getBackendBaseUrl());
}

export function buildBrowserApolloClient(
  authenticityTokensManager: AuthenticityTokensManager,
  authenticationManager: AuthenticationManager,
) {
  return buildIntercodeApolloClient(
    buildClientApolloLink(getClientURL(), authenticityTokensManager, authenticationManager),
  );
}
