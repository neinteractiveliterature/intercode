/* eslint-disable */
import * as Types from '../graphqlTypes.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type ReportsMenuQueryQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type ReportsMenuQueryQuery = (
  { __typename?: 'Query' }
  & { convention?: Types.Maybe<(
    { __typename?: 'Convention' }
    & Pick<Types.Convention, 'id' | 'ticket_mode' | 'ticket_name'>
  )> }
);

export type AttendanceByPaymentAmountQueryQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type AttendanceByPaymentAmountQueryQuery = (
  { __typename?: 'Query' }
  & { convention?: Types.Maybe<(
    { __typename?: 'Convention' }
    & Pick<Types.Convention, 'id' | 'ticket_name'>
    & { reports: (
      { __typename?: 'ConventionReports' }
      & { ticket_count_by_type_and_payment_amount: Array<(
        { __typename?: 'TicketCountByTypeAndPaymentAmount' }
        & Pick<Types.TicketCountByTypeAndPaymentAmount, 'count'>
        & { ticket_type: (
          { __typename?: 'TicketType' }
          & Pick<Types.TicketType, 'id' | 'name' | 'description'>
          & { pricing_schedule: (
            { __typename?: 'ScheduledMoneyValue' }
            & { timespans: Array<(
              { __typename?: 'TimespanWithMoneyValue' }
              & { value: (
                { __typename?: 'Money' }
                & Pick<Types.Money, 'fractional' | 'currency_code'>
              ) }
            )> }
          ) }
        ), payment_amount: (
          { __typename?: 'Money' }
          & Pick<Types.Money, 'fractional' | 'currency_code'>
        ) }
      )>, total_revenue: (
        { __typename?: 'Money' }
        & Pick<Types.Money, 'fractional' | 'currency_code'>
      ) }
    ) }
  )> }
);

export type EventProvidedTicketsQueryQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type EventProvidedTicketsQueryQuery = (
  { __typename?: 'Query' }
  & { convention?: Types.Maybe<(
    { __typename?: 'Convention' }
    & Pick<Types.Convention, 'id' | 'ticket_name'>
    & { reports: (
      { __typename?: 'ConventionReports' }
      & { event_provided_tickets: Array<(
        { __typename?: 'EventProvidedTicketList' }
        & { provided_by_event: (
          { __typename?: 'Event' }
          & Pick<Types.Event, 'id' | 'title'>
        ), tickets: Array<(
          { __typename?: 'Ticket' }
          & Pick<Types.Ticket, 'id'>
          & { user_con_profile: (
            { __typename?: 'UserConProfile' }
            & Pick<Types.UserConProfile, 'id' | 'name_inverted'>
          ), ticket_type: (
            { __typename?: 'TicketType' }
            & Pick<Types.TicketType, 'id' | 'description'>
          ) }
        )> }
      )> }
    ) }
  )> }
);

export type EventsByChoiceQueryQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type EventsByChoiceQueryQuery = (
  { __typename?: 'Query' }
  & { convention?: Types.Maybe<(
    { __typename?: 'Convention' }
    & Pick<Types.Convention, 'id'>
    & { reports: (
      { __typename?: 'ConventionReports' }
      & { events_by_choice: Array<(
        { __typename?: 'EventWithChoiceCounts' }
        & { event: (
          { __typename?: 'Event' }
          & Pick<Types.Event, 'id' | 'title'>
        ), choice_counts: Array<(
          { __typename?: 'ChoiceCount' }
          & Pick<Types.ChoiceCount, 'state' | 'choice' | 'count'>
        )> }
      )> }
    ) }
  )> }
);

export type SignupCountsByStateQueryQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type SignupCountsByStateQueryQuery = (
  { __typename?: 'Query' }
  & { convention?: Types.Maybe<(
    { __typename?: 'Convention' }
    & Pick<Types.Convention, 'id'>
    & { signup_counts_by_state: Array<(
      { __typename?: 'SignupCountByState' }
      & Pick<Types.SignupCountByState, 'state' | 'count'>
    )> }
  )> }
);

export type SignupSpySignupChangesQueryQueryVariables = Types.Exact<{
  filters?: Types.Maybe<Types.SignupChangeFiltersInput>;
  page?: Types.Maybe<Types.Scalars['Int']>;
  perPage?: Types.Maybe<Types.Scalars['Int']>;
}>;


export type SignupSpySignupChangesQueryQuery = (
  { __typename?: 'Query' }
  & { convention?: Types.Maybe<(
    { __typename?: 'Convention' }
    & Pick<Types.Convention, 'id' | 'timezone_name'>
    & { signup_changes_paginated: (
      { __typename?: 'SignupChangesPagination' }
      & Pick<Types.SignupChangesPagination, 'total_entries' | 'total_pages' | 'current_page' | 'per_page'>
      & { entries: Array<(
        { __typename?: 'SignupChange' }
        & Pick<Types.SignupChange, 'id' | 'state' | 'counted' | 'bucket_key' | 'action' | 'created_at'>
        & { previous_signup_change?: Types.Maybe<(
          { __typename?: 'SignupChange' }
          & Pick<Types.SignupChange, 'id' | 'state' | 'counted' | 'bucket_key'>
        )>, signup: (
          { __typename?: 'Signup' }
          & Pick<Types.Signup, 'id' | 'choice'>
        ), run: (
          { __typename?: 'Run' }
          & Pick<Types.Run, 'id'>
          & { event?: Types.Maybe<(
            { __typename?: 'Event' }
            & Pick<Types.Event, 'id' | 'title'>
            & { event_category: (
              { __typename?: 'EventCategory' }
              & Pick<Types.EventCategory, 'id' | 'team_member_name'>
            ), registration_policy?: Types.Maybe<(
              { __typename?: 'RegistrationPolicy' }
              & { buckets: Array<(
                { __typename?: 'RegistrationPolicyBucket' }
                & Pick<Types.RegistrationPolicyBucket, 'key' | 'name' | 'anything'>
              )> }
            )>, team_members: Array<(
              { __typename?: 'TeamMember' }
              & Pick<Types.TeamMember, 'id'>
              & { user_con_profile: (
                { __typename?: 'UserConProfile' }
                & Pick<Types.UserConProfile, 'id'>
              ) }
            )> }
          )> }
        ), user_con_profile: (
          { __typename?: 'UserConProfile' }
          & Pick<Types.UserConProfile, 'id' | 'name_inverted' | 'gravatar_enabled' | 'gravatar_url'>
        ) }
      )> }
    ) }
  )> }
);


export const ReportsMenuQueryDocument = gql`
    query ReportsMenuQuery {
  convention {
    id
    ticket_mode
    ticket_name
  }
}
    `;

/**
 * __useReportsMenuQueryQuery__
 *
 * To run a query within a React component, call `useReportsMenuQueryQuery` and pass it any options that fit your needs.
 * When your component renders, `useReportsMenuQueryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useReportsMenuQueryQuery({
 *   variables: {
 *   },
 * });
 */
export function useReportsMenuQueryQuery(baseOptions?: Apollo.QueryHookOptions<ReportsMenuQueryQuery, ReportsMenuQueryQueryVariables>) {
        return Apollo.useQuery<ReportsMenuQueryQuery, ReportsMenuQueryQueryVariables>(ReportsMenuQueryDocument, baseOptions);
      }
export function useReportsMenuQueryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ReportsMenuQueryQuery, ReportsMenuQueryQueryVariables>) {
          return Apollo.useLazyQuery<ReportsMenuQueryQuery, ReportsMenuQueryQueryVariables>(ReportsMenuQueryDocument, baseOptions);
        }
export type ReportsMenuQueryQueryHookResult = ReturnType<typeof useReportsMenuQueryQuery>;
export type ReportsMenuQueryLazyQueryHookResult = ReturnType<typeof useReportsMenuQueryLazyQuery>;
export type ReportsMenuQueryQueryResult = Apollo.QueryResult<ReportsMenuQueryQuery, ReportsMenuQueryQueryVariables>;
export const AttendanceByPaymentAmountQueryDocument = gql`
    query AttendanceByPaymentAmountQuery {
  convention {
    id
    ticket_name
    reports {
      ticket_count_by_type_and_payment_amount {
        count
        ticket_type {
          id
          name
          description
          pricing_schedule {
            timespans {
              value {
                fractional
                currency_code
              }
            }
          }
        }
        payment_amount {
          fractional
          currency_code
        }
      }
      total_revenue {
        fractional
        currency_code
      }
    }
  }
}
    `;

/**
 * __useAttendanceByPaymentAmountQueryQuery__
 *
 * To run a query within a React component, call `useAttendanceByPaymentAmountQueryQuery` and pass it any options that fit your needs.
 * When your component renders, `useAttendanceByPaymentAmountQueryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAttendanceByPaymentAmountQueryQuery({
 *   variables: {
 *   },
 * });
 */
export function useAttendanceByPaymentAmountQueryQuery(baseOptions?: Apollo.QueryHookOptions<AttendanceByPaymentAmountQueryQuery, AttendanceByPaymentAmountQueryQueryVariables>) {
        return Apollo.useQuery<AttendanceByPaymentAmountQueryQuery, AttendanceByPaymentAmountQueryQueryVariables>(AttendanceByPaymentAmountQueryDocument, baseOptions);
      }
export function useAttendanceByPaymentAmountQueryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<AttendanceByPaymentAmountQueryQuery, AttendanceByPaymentAmountQueryQueryVariables>) {
          return Apollo.useLazyQuery<AttendanceByPaymentAmountQueryQuery, AttendanceByPaymentAmountQueryQueryVariables>(AttendanceByPaymentAmountQueryDocument, baseOptions);
        }
export type AttendanceByPaymentAmountQueryQueryHookResult = ReturnType<typeof useAttendanceByPaymentAmountQueryQuery>;
export type AttendanceByPaymentAmountQueryLazyQueryHookResult = ReturnType<typeof useAttendanceByPaymentAmountQueryLazyQuery>;
export type AttendanceByPaymentAmountQueryQueryResult = Apollo.QueryResult<AttendanceByPaymentAmountQueryQuery, AttendanceByPaymentAmountQueryQueryVariables>;
export const EventProvidedTicketsQueryDocument = gql`
    query EventProvidedTicketsQuery {
  convention {
    id
    ticket_name
    reports {
      event_provided_tickets {
        provided_by_event {
          id
          title
        }
        tickets {
          id
          user_con_profile {
            id
            name_inverted
          }
          ticket_type {
            id
            description
          }
        }
      }
    }
  }
}
    `;

/**
 * __useEventProvidedTicketsQueryQuery__
 *
 * To run a query within a React component, call `useEventProvidedTicketsQueryQuery` and pass it any options that fit your needs.
 * When your component renders, `useEventProvidedTicketsQueryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useEventProvidedTicketsQueryQuery({
 *   variables: {
 *   },
 * });
 */
export function useEventProvidedTicketsQueryQuery(baseOptions?: Apollo.QueryHookOptions<EventProvidedTicketsQueryQuery, EventProvidedTicketsQueryQueryVariables>) {
        return Apollo.useQuery<EventProvidedTicketsQueryQuery, EventProvidedTicketsQueryQueryVariables>(EventProvidedTicketsQueryDocument, baseOptions);
      }
export function useEventProvidedTicketsQueryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<EventProvidedTicketsQueryQuery, EventProvidedTicketsQueryQueryVariables>) {
          return Apollo.useLazyQuery<EventProvidedTicketsQueryQuery, EventProvidedTicketsQueryQueryVariables>(EventProvidedTicketsQueryDocument, baseOptions);
        }
export type EventProvidedTicketsQueryQueryHookResult = ReturnType<typeof useEventProvidedTicketsQueryQuery>;
export type EventProvidedTicketsQueryLazyQueryHookResult = ReturnType<typeof useEventProvidedTicketsQueryLazyQuery>;
export type EventProvidedTicketsQueryQueryResult = Apollo.QueryResult<EventProvidedTicketsQueryQuery, EventProvidedTicketsQueryQueryVariables>;
export const EventsByChoiceQueryDocument = gql`
    query EventsByChoiceQuery {
  convention {
    id
    reports {
      events_by_choice {
        event {
          id
          title
        }
        choice_counts {
          state
          choice
          count
        }
      }
    }
  }
}
    `;

/**
 * __useEventsByChoiceQueryQuery__
 *
 * To run a query within a React component, call `useEventsByChoiceQueryQuery` and pass it any options that fit your needs.
 * When your component renders, `useEventsByChoiceQueryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useEventsByChoiceQueryQuery({
 *   variables: {
 *   },
 * });
 */
export function useEventsByChoiceQueryQuery(baseOptions?: Apollo.QueryHookOptions<EventsByChoiceQueryQuery, EventsByChoiceQueryQueryVariables>) {
        return Apollo.useQuery<EventsByChoiceQueryQuery, EventsByChoiceQueryQueryVariables>(EventsByChoiceQueryDocument, baseOptions);
      }
export function useEventsByChoiceQueryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<EventsByChoiceQueryQuery, EventsByChoiceQueryQueryVariables>) {
          return Apollo.useLazyQuery<EventsByChoiceQueryQuery, EventsByChoiceQueryQueryVariables>(EventsByChoiceQueryDocument, baseOptions);
        }
export type EventsByChoiceQueryQueryHookResult = ReturnType<typeof useEventsByChoiceQueryQuery>;
export type EventsByChoiceQueryLazyQueryHookResult = ReturnType<typeof useEventsByChoiceQueryLazyQuery>;
export type EventsByChoiceQueryQueryResult = Apollo.QueryResult<EventsByChoiceQueryQuery, EventsByChoiceQueryQueryVariables>;
export const SignupCountsByStateQueryDocument = gql`
    query SignupCountsByStateQuery {
  convention {
    id
    signup_counts_by_state {
      state
      count
    }
  }
}
    `;

/**
 * __useSignupCountsByStateQueryQuery__
 *
 * To run a query within a React component, call `useSignupCountsByStateQueryQuery` and pass it any options that fit your needs.
 * When your component renders, `useSignupCountsByStateQueryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSignupCountsByStateQueryQuery({
 *   variables: {
 *   },
 * });
 */
export function useSignupCountsByStateQueryQuery(baseOptions?: Apollo.QueryHookOptions<SignupCountsByStateQueryQuery, SignupCountsByStateQueryQueryVariables>) {
        return Apollo.useQuery<SignupCountsByStateQueryQuery, SignupCountsByStateQueryQueryVariables>(SignupCountsByStateQueryDocument, baseOptions);
      }
export function useSignupCountsByStateQueryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SignupCountsByStateQueryQuery, SignupCountsByStateQueryQueryVariables>) {
          return Apollo.useLazyQuery<SignupCountsByStateQueryQuery, SignupCountsByStateQueryQueryVariables>(SignupCountsByStateQueryDocument, baseOptions);
        }
export type SignupCountsByStateQueryQueryHookResult = ReturnType<typeof useSignupCountsByStateQueryQuery>;
export type SignupCountsByStateQueryLazyQueryHookResult = ReturnType<typeof useSignupCountsByStateQueryLazyQuery>;
export type SignupCountsByStateQueryQueryResult = Apollo.QueryResult<SignupCountsByStateQueryQuery, SignupCountsByStateQueryQueryVariables>;
export const SignupSpySignupChangesQueryDocument = gql`
    query SignupSpySignupChangesQuery($filters: SignupChangeFiltersInput, $page: Int, $perPage: Int) {
  convention {
    id
    timezone_name
    signup_changes_paginated(page: $page, per_page: $perPage, filters: $filters, sort: [{field: "created_at", desc: true}]) {
      total_entries
      total_pages
      current_page
      per_page
      entries {
        id
        state
        counted
        bucket_key
        action
        created_at
        previous_signup_change {
          id
          state
          counted
          bucket_key
        }
        signup {
          id
          choice
        }
        run {
          id
          event {
            id
            title
            event_category {
              id
              team_member_name
            }
            registration_policy {
              buckets {
                key
                name
                anything
              }
            }
            team_members {
              id
              user_con_profile {
                id
              }
            }
          }
        }
        user_con_profile {
          id
          name_inverted
          gravatar_enabled
          gravatar_url
        }
      }
    }
  }
}
    `;

/**
 * __useSignupSpySignupChangesQueryQuery__
 *
 * To run a query within a React component, call `useSignupSpySignupChangesQueryQuery` and pass it any options that fit your needs.
 * When your component renders, `useSignupSpySignupChangesQueryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSignupSpySignupChangesQueryQuery({
 *   variables: {
 *      filters: // value for 'filters'
 *      page: // value for 'page'
 *      perPage: // value for 'perPage'
 *   },
 * });
 */
export function useSignupSpySignupChangesQueryQuery(baseOptions?: Apollo.QueryHookOptions<SignupSpySignupChangesQueryQuery, SignupSpySignupChangesQueryQueryVariables>) {
        return Apollo.useQuery<SignupSpySignupChangesQueryQuery, SignupSpySignupChangesQueryQueryVariables>(SignupSpySignupChangesQueryDocument, baseOptions);
      }
export function useSignupSpySignupChangesQueryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SignupSpySignupChangesQueryQuery, SignupSpySignupChangesQueryQueryVariables>) {
          return Apollo.useLazyQuery<SignupSpySignupChangesQueryQuery, SignupSpySignupChangesQueryQueryVariables>(SignupSpySignupChangesQueryDocument, baseOptions);
        }
export type SignupSpySignupChangesQueryQueryHookResult = ReturnType<typeof useSignupSpySignupChangesQueryQuery>;
export type SignupSpySignupChangesQueryLazyQueryHookResult = ReturnType<typeof useSignupSpySignupChangesQueryLazyQuery>;
export type SignupSpySignupChangesQueryQueryResult = Apollo.QueryResult<SignupSpySignupChangesQueryQuery, SignupSpySignupChangesQueryQueryVariables>;