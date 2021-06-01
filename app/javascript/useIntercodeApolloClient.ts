import { useMemo, RefObject } from 'react';
import { ApolloClient, ApolloLink, Operation, NextLink, InMemoryCache } from '@apollo/client';
import { useAuthHeadersLink, useErrorHandlerLink } from '@neinteractiveliterature/litform';
import { createUploadLink } from 'apollo-upload-client';
import { DateTime } from 'luxon';

import possibleTypes from './possibleTypes.json';

export function useIntercodeApolloLink(
  authenticityToken: string,
  onUnauthenticatedRef?: RefObject<() => void>,
) {
  const AuthLink = useAuthHeadersLink(authenticityToken);

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

  const ErrorHandlerLink = useErrorHandlerLink(onUnauthenticatedRef);

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

export default useIntercodeApolloClient;
