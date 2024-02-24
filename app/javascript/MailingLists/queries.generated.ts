/* eslint-disable */
import * as Types from '../graphqlTypes.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type ContactEmailFieldsFragment = { __typename: 'ContactEmail', email: string, formatted_address: string, name?: string | null, metadata_json: string };

export type MailingListsResultFieldsFragment = { __typename: 'MailingListsResult', metadata_fields: Array<string>, emails: Array<{ __typename: 'ContactEmail', email: string, formatted_address: string, name?: string | null, metadata_json: string }> };

export type MailingListsMenuQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type MailingListsMenuQueryData = { __typename: 'Query', convention: { __typename: 'Convention', id: string, ticket_mode: Types.TicketMode, ticket_name: string } };

export type TicketedAttendeesQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type TicketedAttendeesQueryData = { __typename: 'Query', convention: { __typename: 'Convention', id: string, name: string, ticket_name: string, mailing_lists: { __typename: 'MailingLists', ticketed_attendees: { __typename: 'MailingListsResult', metadata_fields: Array<string>, emails: Array<{ __typename: 'ContactEmail', email: string, formatted_address: string, name?: string | null, metadata_json: string }> } } } };

export type EventProposersQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type EventProposersQueryData = { __typename: 'Query', convention: { __typename: 'Convention', id: string, name: string, mailing_lists: { __typename: 'MailingLists', event_proposers: { __typename: 'MailingListsResult', metadata_fields: Array<string>, emails: Array<{ __typename: 'ContactEmail', email: string, formatted_address: string, name?: string | null, metadata_json: string }> } } } };

export type TeamMembersMailingListQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type TeamMembersMailingListQueryData = { __typename: 'Query', convention: { __typename: 'Convention', id: string, name: string, mailing_lists: { __typename: 'MailingLists', team_members: { __typename: 'MailingListsResult', metadata_fields: Array<string>, emails: Array<{ __typename: 'ContactEmail', email: string, formatted_address: string, name?: string | null, metadata_json: string }> } } } };

export type UsersWithPendingBioQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type UsersWithPendingBioQueryData = { __typename: 'Query', convention: { __typename: 'Convention', id: string, name: string, mailing_lists: { __typename: 'MailingLists', users_with_pending_bio: { __typename: 'MailingListsResult', metadata_fields: Array<string>, emails: Array<{ __typename: 'ContactEmail', email: string, formatted_address: string, name?: string | null, metadata_json: string }> } } } };

export type WaitlistMailingListsQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type WaitlistMailingListsQueryData = { __typename: 'Query', convention: { __typename: 'Convention', id: string, name: string, timezone_name?: string | null, mailing_lists: { __typename: 'MailingLists', waitlists: Array<{ __typename: 'MailingListsWaitlistsResult', metadata_fields: Array<string>, emails: Array<{ __typename: 'ContactEmail', email: string, formatted_address: string, name?: string | null, metadata_json: string }>, run: { __typename: 'Run', id: string, starts_at: string, title_suffix?: string | null, event: { __typename: 'Event', id: string, title?: string | null } } }> } } };

export type WhosFreeFormConventionQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type WhosFreeFormConventionQueryData = { __typename: 'Query', convention: { __typename: 'Convention', id: string, name: string, starts_at?: string | null, ends_at?: string | null, timezone_name?: string | null, timezone_mode: Types.TimezoneMode } };

export type WhosFreeQueryVariables = Types.Exact<{
  start: Types.Scalars['Date']['input'];
  finish: Types.Scalars['Date']['input'];
}>;


export type WhosFreeQueryData = { __typename: 'Query', convention: { __typename: 'Convention', id: string, name: string, mailing_lists: { __typename: 'MailingLists', whos_free: { __typename: 'MailingListsResult', metadata_fields: Array<string>, emails: Array<{ __typename: 'ContactEmail', email: string, formatted_address: string, name?: string | null, metadata_json: string }> } } } };

export const ContactEmailFieldsFragmentDoc = gql`
    fragment ContactEmailFields on ContactEmail {
  email
  formatted_address
  name
  metadata_json
}
    `;
export const MailingListsResultFieldsFragmentDoc = gql`
    fragment MailingListsResultFields on MailingListsResult {
  emails {
    ...ContactEmailFields
  }
  metadata_fields
}
    ${ContactEmailFieldsFragmentDoc}`;
export const MailingListsMenuQueryDocument = gql`
    query MailingListsMenuQuery {
  convention: conventionByRequestHost {
    id
    ticket_mode
    ticket_name
  }
}
    `;

/**
 * __useMailingListsMenuQuery__
 *
 * To run a query within a React component, call `useMailingListsMenuQuery` and pass it any options that fit your needs.
 * When your component renders, `useMailingListsMenuQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMailingListsMenuQuery({
 *   variables: {
 *   },
 * });
 */
export function useMailingListsMenuQuery(baseOptions?: Apollo.QueryHookOptions<MailingListsMenuQueryData, MailingListsMenuQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<MailingListsMenuQueryData, MailingListsMenuQueryVariables>(MailingListsMenuQueryDocument, options);
      }
export function useMailingListsMenuQueryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MailingListsMenuQueryData, MailingListsMenuQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<MailingListsMenuQueryData, MailingListsMenuQueryVariables>(MailingListsMenuQueryDocument, options);
        }
export function useMailingListsMenuQuerySuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<MailingListsMenuQueryData, MailingListsMenuQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<MailingListsMenuQueryData, MailingListsMenuQueryVariables>(MailingListsMenuQueryDocument, options);
        }
export type MailingListsMenuQueryHookResult = ReturnType<typeof useMailingListsMenuQuery>;
export type MailingListsMenuQueryLazyQueryHookResult = ReturnType<typeof useMailingListsMenuQueryLazyQuery>;
export type MailingListsMenuQuerySuspenseQueryHookResult = ReturnType<typeof useMailingListsMenuQuerySuspenseQuery>;
export type MailingListsMenuQueryQueryResult = Apollo.QueryResult<MailingListsMenuQueryData, MailingListsMenuQueryVariables>;
export const TicketedAttendeesQueryDocument = gql`
    query TicketedAttendeesQuery {
  convention: conventionByRequestHost {
    id
    name
    ticket_name
    mailing_lists {
      ticketed_attendees {
        ...MailingListsResultFields
      }
    }
  }
}
    ${MailingListsResultFieldsFragmentDoc}`;

/**
 * __useTicketedAttendeesQuery__
 *
 * To run a query within a React component, call `useTicketedAttendeesQuery` and pass it any options that fit your needs.
 * When your component renders, `useTicketedAttendeesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTicketedAttendeesQuery({
 *   variables: {
 *   },
 * });
 */
export function useTicketedAttendeesQuery(baseOptions?: Apollo.QueryHookOptions<TicketedAttendeesQueryData, TicketedAttendeesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<TicketedAttendeesQueryData, TicketedAttendeesQueryVariables>(TicketedAttendeesQueryDocument, options);
      }
export function useTicketedAttendeesQueryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<TicketedAttendeesQueryData, TicketedAttendeesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<TicketedAttendeesQueryData, TicketedAttendeesQueryVariables>(TicketedAttendeesQueryDocument, options);
        }
export function useTicketedAttendeesQuerySuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<TicketedAttendeesQueryData, TicketedAttendeesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<TicketedAttendeesQueryData, TicketedAttendeesQueryVariables>(TicketedAttendeesQueryDocument, options);
        }
export type TicketedAttendeesQueryHookResult = ReturnType<typeof useTicketedAttendeesQuery>;
export type TicketedAttendeesQueryLazyQueryHookResult = ReturnType<typeof useTicketedAttendeesQueryLazyQuery>;
export type TicketedAttendeesQuerySuspenseQueryHookResult = ReturnType<typeof useTicketedAttendeesQuerySuspenseQuery>;
export type TicketedAttendeesQueryQueryResult = Apollo.QueryResult<TicketedAttendeesQueryData, TicketedAttendeesQueryVariables>;
export const EventProposersQueryDocument = gql`
    query EventProposersQuery {
  convention: conventionByRequestHost {
    id
    name
    mailing_lists {
      event_proposers {
        ...MailingListsResultFields
      }
    }
  }
}
    ${MailingListsResultFieldsFragmentDoc}`;

/**
 * __useEventProposersQuery__
 *
 * To run a query within a React component, call `useEventProposersQuery` and pass it any options that fit your needs.
 * When your component renders, `useEventProposersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useEventProposersQuery({
 *   variables: {
 *   },
 * });
 */
export function useEventProposersQuery(baseOptions?: Apollo.QueryHookOptions<EventProposersQueryData, EventProposersQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<EventProposersQueryData, EventProposersQueryVariables>(EventProposersQueryDocument, options);
      }
export function useEventProposersQueryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<EventProposersQueryData, EventProposersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<EventProposersQueryData, EventProposersQueryVariables>(EventProposersQueryDocument, options);
        }
export function useEventProposersQuerySuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<EventProposersQueryData, EventProposersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<EventProposersQueryData, EventProposersQueryVariables>(EventProposersQueryDocument, options);
        }
export type EventProposersQueryHookResult = ReturnType<typeof useEventProposersQuery>;
export type EventProposersQueryLazyQueryHookResult = ReturnType<typeof useEventProposersQueryLazyQuery>;
export type EventProposersQuerySuspenseQueryHookResult = ReturnType<typeof useEventProposersQuerySuspenseQuery>;
export type EventProposersQueryQueryResult = Apollo.QueryResult<EventProposersQueryData, EventProposersQueryVariables>;
export const TeamMembersMailingListQueryDocument = gql`
    query TeamMembersMailingListQuery {
  convention: conventionByRequestHost {
    id
    name
    mailing_lists {
      team_members {
        ...MailingListsResultFields
      }
    }
  }
}
    ${MailingListsResultFieldsFragmentDoc}`;

/**
 * __useTeamMembersMailingListQuery__
 *
 * To run a query within a React component, call `useTeamMembersMailingListQuery` and pass it any options that fit your needs.
 * When your component renders, `useTeamMembersMailingListQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTeamMembersMailingListQuery({
 *   variables: {
 *   },
 * });
 */
export function useTeamMembersMailingListQuery(baseOptions?: Apollo.QueryHookOptions<TeamMembersMailingListQueryData, TeamMembersMailingListQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<TeamMembersMailingListQueryData, TeamMembersMailingListQueryVariables>(TeamMembersMailingListQueryDocument, options);
      }
export function useTeamMembersMailingListQueryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<TeamMembersMailingListQueryData, TeamMembersMailingListQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<TeamMembersMailingListQueryData, TeamMembersMailingListQueryVariables>(TeamMembersMailingListQueryDocument, options);
        }
export function useTeamMembersMailingListQuerySuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<TeamMembersMailingListQueryData, TeamMembersMailingListQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<TeamMembersMailingListQueryData, TeamMembersMailingListQueryVariables>(TeamMembersMailingListQueryDocument, options);
        }
export type TeamMembersMailingListQueryHookResult = ReturnType<typeof useTeamMembersMailingListQuery>;
export type TeamMembersMailingListQueryLazyQueryHookResult = ReturnType<typeof useTeamMembersMailingListQueryLazyQuery>;
export type TeamMembersMailingListQuerySuspenseQueryHookResult = ReturnType<typeof useTeamMembersMailingListQuerySuspenseQuery>;
export type TeamMembersMailingListQueryQueryResult = Apollo.QueryResult<TeamMembersMailingListQueryData, TeamMembersMailingListQueryVariables>;
export const UsersWithPendingBioQueryDocument = gql`
    query UsersWithPendingBioQuery {
  convention: conventionByRequestHost {
    id
    name
    mailing_lists {
      users_with_pending_bio {
        ...MailingListsResultFields
      }
    }
  }
}
    ${MailingListsResultFieldsFragmentDoc}`;

/**
 * __useUsersWithPendingBioQuery__
 *
 * To run a query within a React component, call `useUsersWithPendingBioQuery` and pass it any options that fit your needs.
 * When your component renders, `useUsersWithPendingBioQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUsersWithPendingBioQuery({
 *   variables: {
 *   },
 * });
 */
export function useUsersWithPendingBioQuery(baseOptions?: Apollo.QueryHookOptions<UsersWithPendingBioQueryData, UsersWithPendingBioQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<UsersWithPendingBioQueryData, UsersWithPendingBioQueryVariables>(UsersWithPendingBioQueryDocument, options);
      }
export function useUsersWithPendingBioQueryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<UsersWithPendingBioQueryData, UsersWithPendingBioQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<UsersWithPendingBioQueryData, UsersWithPendingBioQueryVariables>(UsersWithPendingBioQueryDocument, options);
        }
export function useUsersWithPendingBioQuerySuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<UsersWithPendingBioQueryData, UsersWithPendingBioQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<UsersWithPendingBioQueryData, UsersWithPendingBioQueryVariables>(UsersWithPendingBioQueryDocument, options);
        }
export type UsersWithPendingBioQueryHookResult = ReturnType<typeof useUsersWithPendingBioQuery>;
export type UsersWithPendingBioQueryLazyQueryHookResult = ReturnType<typeof useUsersWithPendingBioQueryLazyQuery>;
export type UsersWithPendingBioQuerySuspenseQueryHookResult = ReturnType<typeof useUsersWithPendingBioQuerySuspenseQuery>;
export type UsersWithPendingBioQueryQueryResult = Apollo.QueryResult<UsersWithPendingBioQueryData, UsersWithPendingBioQueryVariables>;
export const WaitlistMailingListsQueryDocument = gql`
    query WaitlistMailingListsQuery {
  convention: conventionByRequestHost {
    id
    name
    timezone_name
    mailing_lists {
      waitlists {
        emails {
          ...ContactEmailFields
        }
        metadata_fields
        run {
          id
          starts_at
          title_suffix
          event {
            id
            title
          }
        }
      }
    }
  }
}
    ${ContactEmailFieldsFragmentDoc}`;

/**
 * __useWaitlistMailingListsQuery__
 *
 * To run a query within a React component, call `useWaitlistMailingListsQuery` and pass it any options that fit your needs.
 * When your component renders, `useWaitlistMailingListsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useWaitlistMailingListsQuery({
 *   variables: {
 *   },
 * });
 */
export function useWaitlistMailingListsQuery(baseOptions?: Apollo.QueryHookOptions<WaitlistMailingListsQueryData, WaitlistMailingListsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<WaitlistMailingListsQueryData, WaitlistMailingListsQueryVariables>(WaitlistMailingListsQueryDocument, options);
      }
export function useWaitlistMailingListsQueryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<WaitlistMailingListsQueryData, WaitlistMailingListsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<WaitlistMailingListsQueryData, WaitlistMailingListsQueryVariables>(WaitlistMailingListsQueryDocument, options);
        }
export function useWaitlistMailingListsQuerySuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<WaitlistMailingListsQueryData, WaitlistMailingListsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<WaitlistMailingListsQueryData, WaitlistMailingListsQueryVariables>(WaitlistMailingListsQueryDocument, options);
        }
export type WaitlistMailingListsQueryHookResult = ReturnType<typeof useWaitlistMailingListsQuery>;
export type WaitlistMailingListsQueryLazyQueryHookResult = ReturnType<typeof useWaitlistMailingListsQueryLazyQuery>;
export type WaitlistMailingListsQuerySuspenseQueryHookResult = ReturnType<typeof useWaitlistMailingListsQuerySuspenseQuery>;
export type WaitlistMailingListsQueryQueryResult = Apollo.QueryResult<WaitlistMailingListsQueryData, WaitlistMailingListsQueryVariables>;
export const WhosFreeFormConventionQueryDocument = gql`
    query WhosFreeFormConventionQuery {
  convention: conventionByRequestHost {
    id
    name
    starts_at
    ends_at
    timezone_name
    timezone_mode
  }
}
    `;

/**
 * __useWhosFreeFormConventionQuery__
 *
 * To run a query within a React component, call `useWhosFreeFormConventionQuery` and pass it any options that fit your needs.
 * When your component renders, `useWhosFreeFormConventionQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useWhosFreeFormConventionQuery({
 *   variables: {
 *   },
 * });
 */
export function useWhosFreeFormConventionQuery(baseOptions?: Apollo.QueryHookOptions<WhosFreeFormConventionQueryData, WhosFreeFormConventionQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<WhosFreeFormConventionQueryData, WhosFreeFormConventionQueryVariables>(WhosFreeFormConventionQueryDocument, options);
      }
export function useWhosFreeFormConventionQueryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<WhosFreeFormConventionQueryData, WhosFreeFormConventionQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<WhosFreeFormConventionQueryData, WhosFreeFormConventionQueryVariables>(WhosFreeFormConventionQueryDocument, options);
        }
export function useWhosFreeFormConventionQuerySuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<WhosFreeFormConventionQueryData, WhosFreeFormConventionQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<WhosFreeFormConventionQueryData, WhosFreeFormConventionQueryVariables>(WhosFreeFormConventionQueryDocument, options);
        }
export type WhosFreeFormConventionQueryHookResult = ReturnType<typeof useWhosFreeFormConventionQuery>;
export type WhosFreeFormConventionQueryLazyQueryHookResult = ReturnType<typeof useWhosFreeFormConventionQueryLazyQuery>;
export type WhosFreeFormConventionQuerySuspenseQueryHookResult = ReturnType<typeof useWhosFreeFormConventionQuerySuspenseQuery>;
export type WhosFreeFormConventionQueryQueryResult = Apollo.QueryResult<WhosFreeFormConventionQueryData, WhosFreeFormConventionQueryVariables>;
export const WhosFreeQueryDocument = gql`
    query WhosFreeQuery($start: Date!, $finish: Date!) {
  convention: conventionByRequestHost {
    id
    name
    mailing_lists {
      whos_free(start: $start, finish: $finish) {
        ...MailingListsResultFields
      }
    }
  }
}
    ${MailingListsResultFieldsFragmentDoc}`;

/**
 * __useWhosFreeQuery__
 *
 * To run a query within a React component, call `useWhosFreeQuery` and pass it any options that fit your needs.
 * When your component renders, `useWhosFreeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useWhosFreeQuery({
 *   variables: {
 *      start: // value for 'start'
 *      finish: // value for 'finish'
 *   },
 * });
 */
export function useWhosFreeQuery(baseOptions: Apollo.QueryHookOptions<WhosFreeQueryData, WhosFreeQueryVariables> & ({ variables: WhosFreeQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<WhosFreeQueryData, WhosFreeQueryVariables>(WhosFreeQueryDocument, options);
      }
export function useWhosFreeQueryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<WhosFreeQueryData, WhosFreeQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<WhosFreeQueryData, WhosFreeQueryVariables>(WhosFreeQueryDocument, options);
        }
export function useWhosFreeQuerySuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<WhosFreeQueryData, WhosFreeQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<WhosFreeQueryData, WhosFreeQueryVariables>(WhosFreeQueryDocument, options);
        }
export type WhosFreeQueryHookResult = ReturnType<typeof useWhosFreeQuery>;
export type WhosFreeQueryLazyQueryHookResult = ReturnType<typeof useWhosFreeQueryLazyQuery>;
export type WhosFreeQuerySuspenseQueryHookResult = ReturnType<typeof useWhosFreeQuerySuspenseQuery>;
export type WhosFreeQueryQueryResult = Apollo.QueryResult<WhosFreeQueryData, WhosFreeQueryVariables>;