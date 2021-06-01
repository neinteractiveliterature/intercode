/* eslint-disable */
import * as Types from '../graphqlTypes.generated';

import { PricingStructureFieldsFragment } from '../Store/pricingStructureFields.generated';
import { gql } from '@apollo/client';
import { PricingStructureFieldsFragmentDoc } from '../Store/pricingStructureFields.generated';
import * as Apollo from '@apollo/client';
const defaultOptions =  {}
export type ReportsMenuQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type ReportsMenuQueryData = (
  { __typename: 'Query' }
  & { convention: (
    { __typename: 'Convention' }
    & Pick<Types.Convention, 'id' | 'ticket_mode' | 'ticket_name'>
  ) }
);

export type AttendanceByPaymentAmountQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type AttendanceByPaymentAmountQueryData = (
  { __typename: 'Query' }
  & { convention: (
    { __typename: 'Convention' }
    & Pick<Types.Convention, 'id' | 'ticket_name'>
    & { reports: (
      { __typename: 'ConventionReports' }
      & { ticket_count_by_type_and_payment_amount: Array<(
        { __typename: 'TicketCountByTypeAndPaymentAmount' }
        & Pick<Types.TicketCountByTypeAndPaymentAmount, 'count'>
        & { ticket_type: (
          { __typename: 'TicketType' }
          & Pick<Types.TicketType, 'id' | 'name' | 'description'>
          & { providing_products: Array<(
            { __typename: 'Product' }
            & Pick<Types.Product, 'id'>
            & { pricing_structure: (
              { __typename: 'PricingStructure' }
              & PricingStructureFieldsFragment
            ) }
          )> }
        ), payment_amount: (
          { __typename: 'Money' }
          & Pick<Types.Money, 'fractional' | 'currency_code'>
        ) }
      )>, total_revenue: (
        { __typename: 'Money' }
        & Pick<Types.Money, 'fractional' | 'currency_code'>
      ) }
    ) }
  ) }
);

export type EventProvidedTicketsQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type EventProvidedTicketsQueryData = (
  { __typename: 'Query' }
  & { convention: (
    { __typename: 'Convention' }
    & Pick<Types.Convention, 'id' | 'ticket_name'>
    & { reports: (
      { __typename: 'ConventionReports' }
      & { event_provided_tickets: Array<(
        { __typename: 'EventProvidedTicketList' }
        & { provided_by_event: (
          { __typename: 'Event' }
          & Pick<Types.Event, 'id' | 'title'>
        ), tickets: Array<(
          { __typename: 'Ticket' }
          & Pick<Types.Ticket, 'id'>
          & { user_con_profile: (
            { __typename: 'UserConProfile' }
            & Pick<Types.UserConProfile, 'id' | 'name_inverted'>
          ), ticket_type: (
            { __typename: 'TicketType' }
            & Pick<Types.TicketType, 'id' | 'description'>
          ) }
        )> }
      )> }
    ) }
  ) }
);

export type EventsByChoiceQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type EventsByChoiceQueryData = (
  { __typename: 'Query' }
  & { convention: (
    { __typename: 'Convention' }
    & Pick<Types.Convention, 'id'>
    & { reports: (
      { __typename: 'ConventionReports' }
      & { events_by_choice: Array<(
        { __typename: 'EventWithChoiceCounts' }
        & { event: (
          { __typename: 'Event' }
          & Pick<Types.Event, 'id' | 'title'>
        ), choice_counts: Array<(
          { __typename: 'ChoiceCount' }
          & Pick<Types.ChoiceCount, 'state' | 'choice' | 'count'>
        )> }
      )> }
    ) }
  ) }
);

export type SignupCountsByStateQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type SignupCountsByStateQueryData = (
  { __typename: 'Query' }
  & { convention: (
    { __typename: 'Convention' }
    & Pick<Types.Convention, 'id'>
    & { signup_counts_by_state: Array<(
      { __typename: 'SignupCountByState' }
      & Pick<Types.SignupCountByState, 'state' | 'count'>
    )> }
  ) }
);

export type SignupSpySignupChangesQueryVariables = Types.Exact<{
  filters?: Types.Maybe<Types.SignupChangeFiltersInput>;
  page?: Types.Maybe<Types.Scalars['Int']>;
  perPage?: Types.Maybe<Types.Scalars['Int']>;
  sort?: Types.Maybe<Array<Types.SortInput> | Types.SortInput>;
}>;


export type SignupSpySignupChangesQueryData = (
  { __typename: 'Query' }
  & { convention: (
    { __typename: 'Convention' }
    & Pick<Types.Convention, 'id' | 'timezone_name'>
    & { signup_changes_paginated: (
      { __typename: 'SignupChangesPagination' }
      & Pick<Types.SignupChangesPagination, 'total_entries' | 'total_pages' | 'current_page' | 'per_page'>
      & { entries: Array<(
        { __typename: 'SignupChange' }
        & Pick<Types.SignupChange, 'id' | 'state' | 'counted' | 'bucket_key' | 'action' | 'created_at'>
        & { previous_signup_change?: Types.Maybe<(
          { __typename: 'SignupChange' }
          & Pick<Types.SignupChange, 'id' | 'state' | 'counted' | 'bucket_key'>
        )>, signup: (
          { __typename: 'Signup' }
          & Pick<Types.Signup, 'id' | 'choice'>
        ), run: (
          { __typename: 'Run' }
          & Pick<Types.Run, 'id'>
          & { event: (
            { __typename: 'Event' }
            & Pick<Types.Event, 'id' | 'title'>
            & { event_category: (
              { __typename: 'EventCategory' }
              & Pick<Types.EventCategory, 'id' | 'team_member_name'>
            ), registration_policy?: Types.Maybe<(
              { __typename: 'RegistrationPolicy' }
              & { buckets: Array<(
                { __typename: 'RegistrationPolicyBucket' }
                & Pick<Types.RegistrationPolicyBucket, 'key' | 'name' | 'anything'>
              )> }
            )>, team_members: Array<(
              { __typename: 'TeamMember' }
              & Pick<Types.TeamMember, 'id'>
              & { user_con_profile: (
                { __typename: 'UserConProfile' }
                & Pick<Types.UserConProfile, 'id'>
              ) }
            )> }
          ) }
        ), user_con_profile: (
          { __typename: 'UserConProfile' }
          & Pick<Types.UserConProfile, 'id' | 'name_inverted' | 'gravatar_enabled' | 'gravatar_url'>
        ) }
      )> }
    ) }
  ) }
);


export const ReportsMenuQueryDocument = gql`
    query ReportsMenuQuery {
  convention: assertConvention {
    id
    ticket_mode
    ticket_name
  }
}
    `;

/**
 * __useReportsMenuQuery__
 *
 * To run a query within a React component, call `useReportsMenuQuery` and pass it any options that fit your needs.
 * When your component renders, `useReportsMenuQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useReportsMenuQuery({
 *   variables: {
 *   },
 * });
 */
export function useReportsMenuQuery(baseOptions?: Apollo.QueryHookOptions<ReportsMenuQueryData, ReportsMenuQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ReportsMenuQueryData, ReportsMenuQueryVariables>(ReportsMenuQueryDocument, options);
      }
export function useReportsMenuQueryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ReportsMenuQueryData, ReportsMenuQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ReportsMenuQueryData, ReportsMenuQueryVariables>(ReportsMenuQueryDocument, options);
        }
export type ReportsMenuQueryHookResult = ReturnType<typeof useReportsMenuQuery>;
export type ReportsMenuQueryLazyQueryHookResult = ReturnType<typeof useReportsMenuQueryLazyQuery>;
export type ReportsMenuQueryQueryResult = Apollo.QueryResult<ReportsMenuQueryData, ReportsMenuQueryVariables>;
export const AttendanceByPaymentAmountQueryDocument = gql`
    query AttendanceByPaymentAmountQuery {
  convention: assertConvention {
    id
    ticket_name
    reports {
      ticket_count_by_type_and_payment_amount {
        count
        ticket_type {
          id
          name
          description
          providing_products {
            id
            pricing_structure {
              ...PricingStructureFields
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
    ${PricingStructureFieldsFragmentDoc}`;

/**
 * __useAttendanceByPaymentAmountQuery__
 *
 * To run a query within a React component, call `useAttendanceByPaymentAmountQuery` and pass it any options that fit your needs.
 * When your component renders, `useAttendanceByPaymentAmountQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAttendanceByPaymentAmountQuery({
 *   variables: {
 *   },
 * });
 */
export function useAttendanceByPaymentAmountQuery(baseOptions?: Apollo.QueryHookOptions<AttendanceByPaymentAmountQueryData, AttendanceByPaymentAmountQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<AttendanceByPaymentAmountQueryData, AttendanceByPaymentAmountQueryVariables>(AttendanceByPaymentAmountQueryDocument, options);
      }
export function useAttendanceByPaymentAmountQueryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<AttendanceByPaymentAmountQueryData, AttendanceByPaymentAmountQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<AttendanceByPaymentAmountQueryData, AttendanceByPaymentAmountQueryVariables>(AttendanceByPaymentAmountQueryDocument, options);
        }
export type AttendanceByPaymentAmountQueryHookResult = ReturnType<typeof useAttendanceByPaymentAmountQuery>;
export type AttendanceByPaymentAmountQueryLazyQueryHookResult = ReturnType<typeof useAttendanceByPaymentAmountQueryLazyQuery>;
export type AttendanceByPaymentAmountQueryQueryResult = Apollo.QueryResult<AttendanceByPaymentAmountQueryData, AttendanceByPaymentAmountQueryVariables>;
export const EventProvidedTicketsQueryDocument = gql`
    query EventProvidedTicketsQuery {
  convention: assertConvention {
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
 * __useEventProvidedTicketsQuery__
 *
 * To run a query within a React component, call `useEventProvidedTicketsQuery` and pass it any options that fit your needs.
 * When your component renders, `useEventProvidedTicketsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useEventProvidedTicketsQuery({
 *   variables: {
 *   },
 * });
 */
export function useEventProvidedTicketsQuery(baseOptions?: Apollo.QueryHookOptions<EventProvidedTicketsQueryData, EventProvidedTicketsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<EventProvidedTicketsQueryData, EventProvidedTicketsQueryVariables>(EventProvidedTicketsQueryDocument, options);
      }
export function useEventProvidedTicketsQueryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<EventProvidedTicketsQueryData, EventProvidedTicketsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<EventProvidedTicketsQueryData, EventProvidedTicketsQueryVariables>(EventProvidedTicketsQueryDocument, options);
        }
export type EventProvidedTicketsQueryHookResult = ReturnType<typeof useEventProvidedTicketsQuery>;
export type EventProvidedTicketsQueryLazyQueryHookResult = ReturnType<typeof useEventProvidedTicketsQueryLazyQuery>;
export type EventProvidedTicketsQueryQueryResult = Apollo.QueryResult<EventProvidedTicketsQueryData, EventProvidedTicketsQueryVariables>;
export const EventsByChoiceQueryDocument = gql`
    query EventsByChoiceQuery {
  convention: assertConvention {
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
 * __useEventsByChoiceQuery__
 *
 * To run a query within a React component, call `useEventsByChoiceQuery` and pass it any options that fit your needs.
 * When your component renders, `useEventsByChoiceQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useEventsByChoiceQuery({
 *   variables: {
 *   },
 * });
 */
export function useEventsByChoiceQuery(baseOptions?: Apollo.QueryHookOptions<EventsByChoiceQueryData, EventsByChoiceQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<EventsByChoiceQueryData, EventsByChoiceQueryVariables>(EventsByChoiceQueryDocument, options);
      }
export function useEventsByChoiceQueryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<EventsByChoiceQueryData, EventsByChoiceQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<EventsByChoiceQueryData, EventsByChoiceQueryVariables>(EventsByChoiceQueryDocument, options);
        }
export type EventsByChoiceQueryHookResult = ReturnType<typeof useEventsByChoiceQuery>;
export type EventsByChoiceQueryLazyQueryHookResult = ReturnType<typeof useEventsByChoiceQueryLazyQuery>;
export type EventsByChoiceQueryQueryResult = Apollo.QueryResult<EventsByChoiceQueryData, EventsByChoiceQueryVariables>;
export const SignupCountsByStateQueryDocument = gql`
    query SignupCountsByStateQuery {
  convention: assertConvention {
    id
    signup_counts_by_state {
      state
      count
    }
  }
}
    `;

/**
 * __useSignupCountsByStateQuery__
 *
 * To run a query within a React component, call `useSignupCountsByStateQuery` and pass it any options that fit your needs.
 * When your component renders, `useSignupCountsByStateQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSignupCountsByStateQuery({
 *   variables: {
 *   },
 * });
 */
export function useSignupCountsByStateQuery(baseOptions?: Apollo.QueryHookOptions<SignupCountsByStateQueryData, SignupCountsByStateQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<SignupCountsByStateQueryData, SignupCountsByStateQueryVariables>(SignupCountsByStateQueryDocument, options);
      }
export function useSignupCountsByStateQueryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SignupCountsByStateQueryData, SignupCountsByStateQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<SignupCountsByStateQueryData, SignupCountsByStateQueryVariables>(SignupCountsByStateQueryDocument, options);
        }
export type SignupCountsByStateQueryHookResult = ReturnType<typeof useSignupCountsByStateQuery>;
export type SignupCountsByStateQueryLazyQueryHookResult = ReturnType<typeof useSignupCountsByStateQueryLazyQuery>;
export type SignupCountsByStateQueryQueryResult = Apollo.QueryResult<SignupCountsByStateQueryData, SignupCountsByStateQueryVariables>;
export const SignupSpySignupChangesQueryDocument = gql`
    query SignupSpySignupChangesQuery($filters: SignupChangeFiltersInput, $page: Int, $perPage: Int, $sort: [SortInput!]) {
  convention: assertConvention {
    id
    timezone_name
    signup_changes_paginated(
      page: $page
      per_page: $perPage
      filters: $filters
      sort: $sort
    ) {
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
 * __useSignupSpySignupChangesQuery__
 *
 * To run a query within a React component, call `useSignupSpySignupChangesQuery` and pass it any options that fit your needs.
 * When your component renders, `useSignupSpySignupChangesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSignupSpySignupChangesQuery({
 *   variables: {
 *      filters: // value for 'filters'
 *      page: // value for 'page'
 *      perPage: // value for 'perPage'
 *      sort: // value for 'sort'
 *   },
 * });
 */
export function useSignupSpySignupChangesQuery(baseOptions?: Apollo.QueryHookOptions<SignupSpySignupChangesQueryData, SignupSpySignupChangesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<SignupSpySignupChangesQueryData, SignupSpySignupChangesQueryVariables>(SignupSpySignupChangesQueryDocument, options);
      }
export function useSignupSpySignupChangesQueryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SignupSpySignupChangesQueryData, SignupSpySignupChangesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<SignupSpySignupChangesQueryData, SignupSpySignupChangesQueryVariables>(SignupSpySignupChangesQueryDocument, options);
        }
export type SignupSpySignupChangesQueryHookResult = ReturnType<typeof useSignupSpySignupChangesQuery>;
export type SignupSpySignupChangesQueryLazyQueryHookResult = ReturnType<typeof useSignupSpySignupChangesQueryLazyQuery>;
export type SignupSpySignupChangesQueryQueryResult = Apollo.QueryResult<SignupSpySignupChangesQueryData, SignupSpySignupChangesQueryVariables>;