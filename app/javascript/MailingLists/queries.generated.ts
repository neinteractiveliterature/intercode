/* eslint-disable */
import * as Types from '../graphqlTypes.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type ContactEmailFieldsFragment = (
  { __typename: 'ContactEmail' }
  & Pick<Types.ContactEmail, 'email' | 'formatted_address' | 'name' | 'metadata_json'>
);

export type MailingListsResultFieldsFragment = (
  { __typename: 'MailingListsResult' }
  & Pick<Types.MailingListsResult, 'metadata_fields'>
  & { emails: Array<(
    { __typename: 'ContactEmail' }
    & ContactEmailFieldsFragment
  )> }
);

export type MailingListsMenuQueryQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type MailingListsMenuQueryQuery = (
  { __typename: 'Query' }
  & { convention?: Types.Maybe<(
    { __typename: 'Convention' }
    & Pick<Types.Convention, 'id' | 'ticket_mode' | 'ticket_name'>
  )> }
);

export type TicketedAttendeesQueryQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type TicketedAttendeesQueryQuery = (
  { __typename: 'Query' }
  & { convention?: Types.Maybe<(
    { __typename: 'Convention' }
    & Pick<Types.Convention, 'id' | 'name' | 'ticket_name'>
    & { mailing_lists: (
      { __typename: 'MailingLists' }
      & { ticketed_attendees: (
        { __typename: 'MailingListsResult' }
        & MailingListsResultFieldsFragment
      ) }
    ) }
  )> }
);

export type EventProposersQueryQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type EventProposersQueryQuery = (
  { __typename: 'Query' }
  & { convention?: Types.Maybe<(
    { __typename: 'Convention' }
    & Pick<Types.Convention, 'id' | 'name'>
    & { mailing_lists: (
      { __typename: 'MailingLists' }
      & { event_proposers: (
        { __typename: 'MailingListsResult' }
        & MailingListsResultFieldsFragment
      ) }
    ) }
  )> }
);

export type TeamMembersMailingListQueryQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type TeamMembersMailingListQueryQuery = (
  { __typename: 'Query' }
  & { convention?: Types.Maybe<(
    { __typename: 'Convention' }
    & Pick<Types.Convention, 'id' | 'name'>
    & { mailing_lists: (
      { __typename: 'MailingLists' }
      & { team_members: (
        { __typename: 'MailingListsResult' }
        & MailingListsResultFieldsFragment
      ) }
    ) }
  )> }
);

export type UsersWithPendingBioQueryQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type UsersWithPendingBioQueryQuery = (
  { __typename: 'Query' }
  & { convention?: Types.Maybe<(
    { __typename: 'Convention' }
    & Pick<Types.Convention, 'id' | 'name'>
    & { mailing_lists: (
      { __typename: 'MailingLists' }
      & { users_with_pending_bio: (
        { __typename: 'MailingListsResult' }
        & MailingListsResultFieldsFragment
      ) }
    ) }
  )> }
);

export type WaitlistMailingListsQueryQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type WaitlistMailingListsQueryQuery = (
  { __typename: 'Query' }
  & { convention?: Types.Maybe<(
    { __typename: 'Convention' }
    & Pick<Types.Convention, 'id' | 'name' | 'timezone_name'>
    & { mailing_lists: (
      { __typename: 'MailingLists' }
      & { waitlists: Array<(
        { __typename: 'MailingListsWaitlistsResult' }
        & Pick<Types.MailingListsWaitlistsResult, 'metadata_fields'>
        & { emails: Array<(
          { __typename: 'ContactEmail' }
          & ContactEmailFieldsFragment
        )>, run: (
          { __typename: 'Run' }
          & Pick<Types.Run, 'id' | 'starts_at' | 'title_suffix'>
          & { event: (
            { __typename: 'Event' }
            & Pick<Types.Event, 'id' | 'title'>
          ) }
        ) }
      )> }
    ) }
  )> }
);

export type WhosFreeFormConventionQueryQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type WhosFreeFormConventionQueryQuery = (
  { __typename: 'Query' }
  & { convention?: Types.Maybe<(
    { __typename: 'Convention' }
    & Pick<Types.Convention, 'id' | 'name' | 'starts_at' | 'ends_at' | 'timezone_name'>
  )> }
);

export type WhosFreeQueryQueryVariables = Types.Exact<{
  start: Types.Scalars['Date'];
  finish: Types.Scalars['Date'];
}>;


export type WhosFreeQueryQuery = (
  { __typename: 'Query' }
  & { convention?: Types.Maybe<(
    { __typename: 'Convention' }
    & Pick<Types.Convention, 'id'>
    & { mailing_lists: (
      { __typename: 'MailingLists' }
      & { whos_free: (
        { __typename: 'MailingListsResult' }
        & MailingListsResultFieldsFragment
      ) }
    ) }
  )> }
);

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
  convention {
    id
    ticket_mode
    ticket_name
  }
}
    `;

/**
 * __useMailingListsMenuQueryQuery__
 *
 * To run a query within a React component, call `useMailingListsMenuQueryQuery` and pass it any options that fit your needs.
 * When your component renders, `useMailingListsMenuQueryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMailingListsMenuQueryQuery({
 *   variables: {
 *   },
 * });
 */
export function useMailingListsMenuQueryQuery(baseOptions?: Apollo.QueryHookOptions<MailingListsMenuQueryQuery, MailingListsMenuQueryQueryVariables>) {
        return Apollo.useQuery<MailingListsMenuQueryQuery, MailingListsMenuQueryQueryVariables>(MailingListsMenuQueryDocument, baseOptions);
      }
export function useMailingListsMenuQueryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MailingListsMenuQueryQuery, MailingListsMenuQueryQueryVariables>) {
          return Apollo.useLazyQuery<MailingListsMenuQueryQuery, MailingListsMenuQueryQueryVariables>(MailingListsMenuQueryDocument, baseOptions);
        }
export type MailingListsMenuQueryQueryHookResult = ReturnType<typeof useMailingListsMenuQueryQuery>;
export type MailingListsMenuQueryLazyQueryHookResult = ReturnType<typeof useMailingListsMenuQueryLazyQuery>;
export type MailingListsMenuQueryQueryResult = Apollo.QueryResult<MailingListsMenuQueryQuery, MailingListsMenuQueryQueryVariables>;
export const TicketedAttendeesQueryDocument = gql`
    query TicketedAttendeesQuery {
  convention {
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
 * __useTicketedAttendeesQueryQuery__
 *
 * To run a query within a React component, call `useTicketedAttendeesQueryQuery` and pass it any options that fit your needs.
 * When your component renders, `useTicketedAttendeesQueryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTicketedAttendeesQueryQuery({
 *   variables: {
 *   },
 * });
 */
export function useTicketedAttendeesQueryQuery(baseOptions?: Apollo.QueryHookOptions<TicketedAttendeesQueryQuery, TicketedAttendeesQueryQueryVariables>) {
        return Apollo.useQuery<TicketedAttendeesQueryQuery, TicketedAttendeesQueryQueryVariables>(TicketedAttendeesQueryDocument, baseOptions);
      }
export function useTicketedAttendeesQueryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<TicketedAttendeesQueryQuery, TicketedAttendeesQueryQueryVariables>) {
          return Apollo.useLazyQuery<TicketedAttendeesQueryQuery, TicketedAttendeesQueryQueryVariables>(TicketedAttendeesQueryDocument, baseOptions);
        }
export type TicketedAttendeesQueryQueryHookResult = ReturnType<typeof useTicketedAttendeesQueryQuery>;
export type TicketedAttendeesQueryLazyQueryHookResult = ReturnType<typeof useTicketedAttendeesQueryLazyQuery>;
export type TicketedAttendeesQueryQueryResult = Apollo.QueryResult<TicketedAttendeesQueryQuery, TicketedAttendeesQueryQueryVariables>;
export const EventProposersQueryDocument = gql`
    query EventProposersQuery {
  convention {
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
 * __useEventProposersQueryQuery__
 *
 * To run a query within a React component, call `useEventProposersQueryQuery` and pass it any options that fit your needs.
 * When your component renders, `useEventProposersQueryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useEventProposersQueryQuery({
 *   variables: {
 *   },
 * });
 */
export function useEventProposersQueryQuery(baseOptions?: Apollo.QueryHookOptions<EventProposersQueryQuery, EventProposersQueryQueryVariables>) {
        return Apollo.useQuery<EventProposersQueryQuery, EventProposersQueryQueryVariables>(EventProposersQueryDocument, baseOptions);
      }
export function useEventProposersQueryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<EventProposersQueryQuery, EventProposersQueryQueryVariables>) {
          return Apollo.useLazyQuery<EventProposersQueryQuery, EventProposersQueryQueryVariables>(EventProposersQueryDocument, baseOptions);
        }
export type EventProposersQueryQueryHookResult = ReturnType<typeof useEventProposersQueryQuery>;
export type EventProposersQueryLazyQueryHookResult = ReturnType<typeof useEventProposersQueryLazyQuery>;
export type EventProposersQueryQueryResult = Apollo.QueryResult<EventProposersQueryQuery, EventProposersQueryQueryVariables>;
export const TeamMembersMailingListQueryDocument = gql`
    query TeamMembersMailingListQuery {
  convention {
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
 * __useTeamMembersMailingListQueryQuery__
 *
 * To run a query within a React component, call `useTeamMembersMailingListQueryQuery` and pass it any options that fit your needs.
 * When your component renders, `useTeamMembersMailingListQueryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTeamMembersMailingListQueryQuery({
 *   variables: {
 *   },
 * });
 */
export function useTeamMembersMailingListQueryQuery(baseOptions?: Apollo.QueryHookOptions<TeamMembersMailingListQueryQuery, TeamMembersMailingListQueryQueryVariables>) {
        return Apollo.useQuery<TeamMembersMailingListQueryQuery, TeamMembersMailingListQueryQueryVariables>(TeamMembersMailingListQueryDocument, baseOptions);
      }
export function useTeamMembersMailingListQueryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<TeamMembersMailingListQueryQuery, TeamMembersMailingListQueryQueryVariables>) {
          return Apollo.useLazyQuery<TeamMembersMailingListQueryQuery, TeamMembersMailingListQueryQueryVariables>(TeamMembersMailingListQueryDocument, baseOptions);
        }
export type TeamMembersMailingListQueryQueryHookResult = ReturnType<typeof useTeamMembersMailingListQueryQuery>;
export type TeamMembersMailingListQueryLazyQueryHookResult = ReturnType<typeof useTeamMembersMailingListQueryLazyQuery>;
export type TeamMembersMailingListQueryQueryResult = Apollo.QueryResult<TeamMembersMailingListQueryQuery, TeamMembersMailingListQueryQueryVariables>;
export const UsersWithPendingBioQueryDocument = gql`
    query UsersWithPendingBioQuery {
  convention {
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
 * __useUsersWithPendingBioQueryQuery__
 *
 * To run a query within a React component, call `useUsersWithPendingBioQueryQuery` and pass it any options that fit your needs.
 * When your component renders, `useUsersWithPendingBioQueryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUsersWithPendingBioQueryQuery({
 *   variables: {
 *   },
 * });
 */
export function useUsersWithPendingBioQueryQuery(baseOptions?: Apollo.QueryHookOptions<UsersWithPendingBioQueryQuery, UsersWithPendingBioQueryQueryVariables>) {
        return Apollo.useQuery<UsersWithPendingBioQueryQuery, UsersWithPendingBioQueryQueryVariables>(UsersWithPendingBioQueryDocument, baseOptions);
      }
export function useUsersWithPendingBioQueryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<UsersWithPendingBioQueryQuery, UsersWithPendingBioQueryQueryVariables>) {
          return Apollo.useLazyQuery<UsersWithPendingBioQueryQuery, UsersWithPendingBioQueryQueryVariables>(UsersWithPendingBioQueryDocument, baseOptions);
        }
export type UsersWithPendingBioQueryQueryHookResult = ReturnType<typeof useUsersWithPendingBioQueryQuery>;
export type UsersWithPendingBioQueryLazyQueryHookResult = ReturnType<typeof useUsersWithPendingBioQueryLazyQuery>;
export type UsersWithPendingBioQueryQueryResult = Apollo.QueryResult<UsersWithPendingBioQueryQuery, UsersWithPendingBioQueryQueryVariables>;
export const WaitlistMailingListsQueryDocument = gql`
    query WaitlistMailingListsQuery {
  convention {
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
 * __useWaitlistMailingListsQueryQuery__
 *
 * To run a query within a React component, call `useWaitlistMailingListsQueryQuery` and pass it any options that fit your needs.
 * When your component renders, `useWaitlistMailingListsQueryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useWaitlistMailingListsQueryQuery({
 *   variables: {
 *   },
 * });
 */
export function useWaitlistMailingListsQueryQuery(baseOptions?: Apollo.QueryHookOptions<WaitlistMailingListsQueryQuery, WaitlistMailingListsQueryQueryVariables>) {
        return Apollo.useQuery<WaitlistMailingListsQueryQuery, WaitlistMailingListsQueryQueryVariables>(WaitlistMailingListsQueryDocument, baseOptions);
      }
export function useWaitlistMailingListsQueryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<WaitlistMailingListsQueryQuery, WaitlistMailingListsQueryQueryVariables>) {
          return Apollo.useLazyQuery<WaitlistMailingListsQueryQuery, WaitlistMailingListsQueryQueryVariables>(WaitlistMailingListsQueryDocument, baseOptions);
        }
export type WaitlistMailingListsQueryQueryHookResult = ReturnType<typeof useWaitlistMailingListsQueryQuery>;
export type WaitlistMailingListsQueryLazyQueryHookResult = ReturnType<typeof useWaitlistMailingListsQueryLazyQuery>;
export type WaitlistMailingListsQueryQueryResult = Apollo.QueryResult<WaitlistMailingListsQueryQuery, WaitlistMailingListsQueryQueryVariables>;
export const WhosFreeFormConventionQueryDocument = gql`
    query WhosFreeFormConventionQuery {
  convention {
    id
    name
    starts_at
    ends_at
    timezone_name
  }
}
    `;

/**
 * __useWhosFreeFormConventionQueryQuery__
 *
 * To run a query within a React component, call `useWhosFreeFormConventionQueryQuery` and pass it any options that fit your needs.
 * When your component renders, `useWhosFreeFormConventionQueryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useWhosFreeFormConventionQueryQuery({
 *   variables: {
 *   },
 * });
 */
export function useWhosFreeFormConventionQueryQuery(baseOptions?: Apollo.QueryHookOptions<WhosFreeFormConventionQueryQuery, WhosFreeFormConventionQueryQueryVariables>) {
        return Apollo.useQuery<WhosFreeFormConventionQueryQuery, WhosFreeFormConventionQueryQueryVariables>(WhosFreeFormConventionQueryDocument, baseOptions);
      }
export function useWhosFreeFormConventionQueryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<WhosFreeFormConventionQueryQuery, WhosFreeFormConventionQueryQueryVariables>) {
          return Apollo.useLazyQuery<WhosFreeFormConventionQueryQuery, WhosFreeFormConventionQueryQueryVariables>(WhosFreeFormConventionQueryDocument, baseOptions);
        }
export type WhosFreeFormConventionQueryQueryHookResult = ReturnType<typeof useWhosFreeFormConventionQueryQuery>;
export type WhosFreeFormConventionQueryLazyQueryHookResult = ReturnType<typeof useWhosFreeFormConventionQueryLazyQuery>;
export type WhosFreeFormConventionQueryQueryResult = Apollo.QueryResult<WhosFreeFormConventionQueryQuery, WhosFreeFormConventionQueryQueryVariables>;
export const WhosFreeQueryDocument = gql`
    query WhosFreeQuery($start: Date!, $finish: Date!) {
  convention {
    id
    mailing_lists {
      whos_free(start: $start, finish: $finish) {
        ...MailingListsResultFields
      }
    }
  }
}
    ${MailingListsResultFieldsFragmentDoc}`;

/**
 * __useWhosFreeQueryQuery__
 *
 * To run a query within a React component, call `useWhosFreeQueryQuery` and pass it any options that fit your needs.
 * When your component renders, `useWhosFreeQueryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useWhosFreeQueryQuery({
 *   variables: {
 *      start: // value for 'start'
 *      finish: // value for 'finish'
 *   },
 * });
 */
export function useWhosFreeQueryQuery(baseOptions?: Apollo.QueryHookOptions<WhosFreeQueryQuery, WhosFreeQueryQueryVariables>) {
        return Apollo.useQuery<WhosFreeQueryQuery, WhosFreeQueryQueryVariables>(WhosFreeQueryDocument, baseOptions);
      }
export function useWhosFreeQueryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<WhosFreeQueryQuery, WhosFreeQueryQueryVariables>) {
          return Apollo.useLazyQuery<WhosFreeQueryQuery, WhosFreeQueryQueryVariables>(WhosFreeQueryDocument, baseOptions);
        }
export type WhosFreeQueryQueryHookResult = ReturnType<typeof useWhosFreeQueryQuery>;
export type WhosFreeQueryLazyQueryHookResult = ReturnType<typeof useWhosFreeQueryLazyQuery>;
export type WhosFreeQueryQueryResult = Apollo.QueryResult<WhosFreeQueryQuery, WhosFreeQueryQueryVariables>;