import { useMemo } from 'react';
import { ApolloClient, ApolloLink, CombinedGraphQLErrors, InMemoryCache } from '@apollo/client';
import { BatchHttpLink } from '@apollo/client/link/batch-http';
import UploadHttpLink from 'apollo-upload-client/UploadHttpLink.mjs';
import { DateTime } from 'luxon';
import { ErrorLink } from '@apollo/client/link/error';
import { SetContextLink } from '@apollo/client/link/context';
import { Observable } from 'rxjs';

import possibleTypes from './possibleTypes.json';
import AuthenticityTokensManager from './AuthenticityTokensContext';
import { AuthenticationManager } from './Authentication/authenticationManager';
import { GraphQLFormattedError } from 'graphql';
import { EventsPagination } from 'graphqlTypes.generated';

const BEARER_REJECTED_HEADER = 'X-Bearer-Token-Rejected';

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

const AddTimezoneLink = new ApolloLink((operation: ApolloLink.Operation, next: ApolloLink.ForwardFunction) => {
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
  authenticationManager?: AuthenticationManager,
) {
  return new SetContextLink(async (prevContext) => {
    const jwtToken = authenticationManager ? await authenticationManager.ensureFreshAccessToken() : undefined;
    if (jwtToken) {
      return {
        ...prevContext,
        headers: {
          ...prevContext.headers,
          Authorization: `Bearer ${jwtToken}`,
        },
      };
    }

    return {
      ...prevContext,
      credentials: 'same-origin',
      headers: {
        ...prevContext.headers,
        'X-CSRF-Token': authenticityTokensManager.tokens?.graphql,
      },
    };
  });
}

// When the server signals (via `X-Bearer-Token-Rejected`) that it ignored our
// bearer because the token was expired or revoked, force a refresh and retry
// the request once. Needed alongside the proactive JWT-exp check in
// `AuthenticationManager.ensureFreshAccessToken`: that only handles cases where
// the client clock agrees with the server. If the local clock is behind, the
// access token looks fresh locally but is actually past its server-side expiry,
// and only the server's response tells us.
export function buildRefreshOnRejectedBearerLink(authenticationManager?: AuthenticationManager): ApolloLink {
  return new ApolloLink((operation, next) => {
    if (!authenticationManager) {
      return next(operation);
    }
    return new Observable((observer) => {
      let attemptedRefresh = false;
      let activeSubscription: { unsubscribe(): void } | undefined;

      const runOnce = () => {
        // Tear down the previous attempt so its `complete`/`error` events
        // can't race the retry.
        activeSubscription?.unsubscribe();
        activeSubscription = next(operation).subscribe({
          next: (result) => {
            const response = operation.getContext().response as Response | undefined;
            if (!attemptedRefresh && response?.headers?.get(BEARER_REJECTED_HEADER) === 'true') {
              attemptedRefresh = true;
              // Mark the access token as known-bad so the auth-headers link
              // can't reuse it, then refresh and re-run the chain.
              authenticationManager.jwtToken = undefined;
              authenticationManager
                .ensureFreshAccessToken()
                .then((fresh) => {
                  if (fresh) {
                    runOnce();
                  } else {
                    observer.next(result);
                    observer.complete();
                  }
                })
                .catch(() => {
                  observer.next(result);
                  observer.complete();
                });
              return;
            }
            observer.next(result);
          },
          error: (err) => observer.error(err),
          complete: () => observer.complete(),
        });
      };

      runOnce();
      return () => activeSubscription?.unsubscribe();
    });
  });
}

export function buildTerminatingApolloLink(options: BatchHttpLink.Options): ApolloLink {
  // adapted from https://github.com/jaydenseric/apollo-upload-client/issues/63#issuecomment-392501449
  return ApolloLink.split(isUpload, new UploadHttpLink(options), new BatchHttpLink(options));
}

export function buildClientApolloLink(
  uri: URL,
  authenticityTokensManager: AuthenticityTokensManager,
  authenticationManager?: AuthenticationManager,
): ApolloLink {
  return ApolloLink.from([
    // Sits above the auth-headers link so a retry re-runs the bearer-attaching
    // step with the freshly minted token.
    buildRefreshOnRejectedBearerLink(authenticationManager),
    buildAuthHeadersLink(authenticityTokensManager, authenticationManager),
    AddTimezoneLink,
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
  authenticationManager?: AuthenticationManager,
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
      Convention: {
        fields: {
          events_paginated: {
            keyArgs: false,
            merge(existing: EventsPagination | null | undefined, incoming: EventsPagination, { args }) {
              const merged = existing ? existing.entries.slice(0) : [];
              const offset = ((args?.page ?? 1) - 1) * (args?.per_page ?? 20);
              for (let i = 0; i < incoming.entries.length; ++i) {
                merged[offset + i] = incoming.entries[i];
              }

              return {
                ...incoming,
                entries: merged,
              };
            },
          },
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
  if (typeof window !== 'undefined') {
    return new URL('/graphql', window.location.href);
  } else {
    return new URL('/graphql', process.env.INTERCODE_BACKEND);
  }
}

export function buildBrowserApolloClient(
  authenticityTokensManager: AuthenticityTokensManager,
  authenticationManager?: AuthenticationManager,
) {
  return buildIntercodeApolloClient(
    buildClientApolloLink(getClientURL(), authenticityTokensManager, authenticationManager),
  );
}
