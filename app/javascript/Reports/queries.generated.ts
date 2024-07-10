/* eslint-disable */
import * as Types from '../graphqlTypes.generated';

import { gql } from '@apollo/client';
import { PricingStructureFieldsFragmentDoc } from '../Store/pricingStructureFields.generated';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type ReportsMenuQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type ReportsMenuQueryData = { __typename: 'Query', convention: { __typename: 'Convention', id: string, ticket_mode: Types.TicketMode, ticket_name: string, ticketNamePlural: string } };

export type AttendanceByPaymentAmountQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type AttendanceByPaymentAmountQueryData = { __typename: 'Query', convention: { __typename: 'Convention', id: string, ticket_name: string, ticketNamePlural: string, reports: { __typename: 'ConventionReports', sales_count_by_product_and_payment_amount: Array<{ __typename: 'SalesCountByProductAndPaymentAmount', count: number, product: { __typename: 'Product', id: string, name: string, provides_ticket_type?: { __typename: 'TicketType', id: string, name: string, description?: string | null, providing_products: Array<{ __typename: 'Product', id: string, pricing_structure: { __typename: 'PricingStructure', pricing_strategy: Types.PricingStrategy, price?: { __typename: 'Money', fractional: number, currency_code: string } | null, value: { __typename: 'Money', fractional: number, currency_code: string } | { __typename: 'PayWhatYouWantValue', allowed_currency_codes?: Array<string> | null, maximum_amount?: { __typename: 'Money', currency_code: string, fractional: number } | null, minimum_amount?: { __typename: 'Money', currency_code: string, fractional: number } | null, suggested_amount?: { __typename: 'Money', currency_code: string, fractional: number } | null } | { __typename: 'ScheduledMoneyValue', timespans: Array<{ __typename: 'TimespanWithMoneyValue', start?: string | null, finish?: string | null, value: { __typename: 'Money', fractional: number, currency_code: string } }> } } }> } | null }, payment_amount: { __typename: 'Money', fractional: number, currency_code: string } }>, sum_revenue: { __typename: 'Money', fractional: number, currency_code: string } } } };

export type EventProvidedTicketsQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type EventProvidedTicketsQueryData = { __typename: 'Query', convention: { __typename: 'Convention', id: string, ticket_name: string, ticketNamePlural: string, reports: { __typename: 'ConventionReports', event_provided_tickets: Array<{ __typename: 'EventProvidedTicketList', provided_by_event: { __typename: 'Event', id: string, title?: string | null }, tickets: Array<{ __typename: 'Ticket', id: string, user_con_profile: { __typename: 'UserConProfile', id: string, name_inverted: string }, ticket_type: { __typename: 'TicketType', id: string, description?: string | null } }> }> } } };

export type EventsByChoiceQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type EventsByChoiceQueryData = { __typename: 'Query', convention: { __typename: 'Convention', id: string, reports: { __typename: 'ConventionReports', events_by_choice: Array<{ __typename: 'EventWithChoiceCounts', event: { __typename: 'Event', id: string, title?: string | null }, choice_counts: Array<{ __typename: 'ChoiceCount', state: Types.SignupState, choice: number, count: number }> }> } } };

export type SignupCountsByStateQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type SignupCountsByStateQueryData = { __typename: 'Query', convention: { __typename: 'Convention', id: string, signup_counts_by_state: Array<{ __typename: 'SignupCountByState', state: Types.SignupState, count: number }> } };

export type SignupSpySignupChangesQueryVariables = Types.Exact<{
  filters?: Types.InputMaybe<Types.SignupChangeFiltersInput>;
  page?: Types.InputMaybe<Types.Scalars['Int']['input']>;
  perPage?: Types.InputMaybe<Types.Scalars['Int']['input']>;
  sort?: Types.InputMaybe<Array<Types.SortInput> | Types.SortInput>;
}>;


export type SignupSpySignupChangesQueryData = { __typename: 'Query', convention: { __typename: 'Convention', id: string, timezone_name?: string | null, signup_changes_paginated: { __typename: 'SignupChangesPagination', total_entries: number, total_pages: number, current_page: number, per_page: number, entries: Array<{ __typename: 'SignupChange', id: string, state: Types.SignupState, counted: boolean, bucket_key?: string | null, action: Types.SignupChangeAction, created_at: string, previous_signup_change?: { __typename: 'SignupChange', id: string, state: Types.SignupState, counted: boolean, bucket_key?: string | null } | null, signup: { __typename: 'Signup', id: string, choice?: number | null }, run: { __typename: 'Run', id: string, event: { __typename: 'Event', id: string, title?: string | null, event_category: { __typename: 'EventCategory', id: string, team_member_name: string }, registration_policy?: { __typename: 'RegistrationPolicy', buckets: Array<{ __typename: 'RegistrationPolicyBucket', key: string, name?: string | null, anything: boolean }> } | null, team_members: Array<{ __typename: 'TeamMember', id: string, user_con_profile: { __typename: 'UserConProfile', id: string } }> } }, user_con_profile: { __typename: 'UserConProfile', id: string, name_inverted: string, gravatar_enabled: boolean, gravatar_url: string } }> } } };


export const ReportsMenuQueryDocument = gql`
    query ReportsMenuQuery {
  convention: conventionByRequestHost {
    id
    ticket_mode
    ticket_name
    ticketNamePlural
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
export function useReportsMenuQuerySuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<ReportsMenuQueryData, ReportsMenuQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<ReportsMenuQueryData, ReportsMenuQueryVariables>(ReportsMenuQueryDocument, options);
        }
export type ReportsMenuQueryHookResult = ReturnType<typeof useReportsMenuQuery>;
export type ReportsMenuQueryLazyQueryHookResult = ReturnType<typeof useReportsMenuQueryLazyQuery>;
export type ReportsMenuQuerySuspenseQueryHookResult = ReturnType<typeof useReportsMenuQuerySuspenseQuery>;
export type ReportsMenuQueryQueryResult = Apollo.QueryResult<ReportsMenuQueryData, ReportsMenuQueryVariables>;
export const AttendanceByPaymentAmountQueryDocument = gql`
    query AttendanceByPaymentAmountQuery {
  convention: conventionByRequestHost {
    id
    ticket_name
    ticketNamePlural
    reports {
      sales_count_by_product_and_payment_amount {
        count
        product {
          id
          name
          provides_ticket_type {
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
        }
        payment_amount {
          fractional
          currency_code
        }
      }
      sum_revenue {
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
export function useAttendanceByPaymentAmountQuerySuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<AttendanceByPaymentAmountQueryData, AttendanceByPaymentAmountQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<AttendanceByPaymentAmountQueryData, AttendanceByPaymentAmountQueryVariables>(AttendanceByPaymentAmountQueryDocument, options);
        }
export type AttendanceByPaymentAmountQueryHookResult = ReturnType<typeof useAttendanceByPaymentAmountQuery>;
export type AttendanceByPaymentAmountQueryLazyQueryHookResult = ReturnType<typeof useAttendanceByPaymentAmountQueryLazyQuery>;
export type AttendanceByPaymentAmountQuerySuspenseQueryHookResult = ReturnType<typeof useAttendanceByPaymentAmountQuerySuspenseQuery>;
export type AttendanceByPaymentAmountQueryQueryResult = Apollo.QueryResult<AttendanceByPaymentAmountQueryData, AttendanceByPaymentAmountQueryVariables>;
export const EventProvidedTicketsQueryDocument = gql`
    query EventProvidedTicketsQuery {
  convention: conventionByRequestHost {
    id
    ticket_name
    ticketNamePlural
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
export function useEventProvidedTicketsQuerySuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<EventProvidedTicketsQueryData, EventProvidedTicketsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<EventProvidedTicketsQueryData, EventProvidedTicketsQueryVariables>(EventProvidedTicketsQueryDocument, options);
        }
export type EventProvidedTicketsQueryHookResult = ReturnType<typeof useEventProvidedTicketsQuery>;
export type EventProvidedTicketsQueryLazyQueryHookResult = ReturnType<typeof useEventProvidedTicketsQueryLazyQuery>;
export type EventProvidedTicketsQuerySuspenseQueryHookResult = ReturnType<typeof useEventProvidedTicketsQuerySuspenseQuery>;
export type EventProvidedTicketsQueryQueryResult = Apollo.QueryResult<EventProvidedTicketsQueryData, EventProvidedTicketsQueryVariables>;
export const EventsByChoiceQueryDocument = gql`
    query EventsByChoiceQuery {
  convention: conventionByRequestHost {
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
export function useEventsByChoiceQuerySuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<EventsByChoiceQueryData, EventsByChoiceQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<EventsByChoiceQueryData, EventsByChoiceQueryVariables>(EventsByChoiceQueryDocument, options);
        }
export type EventsByChoiceQueryHookResult = ReturnType<typeof useEventsByChoiceQuery>;
export type EventsByChoiceQueryLazyQueryHookResult = ReturnType<typeof useEventsByChoiceQueryLazyQuery>;
export type EventsByChoiceQuerySuspenseQueryHookResult = ReturnType<typeof useEventsByChoiceQuerySuspenseQuery>;
export type EventsByChoiceQueryQueryResult = Apollo.QueryResult<EventsByChoiceQueryData, EventsByChoiceQueryVariables>;
export const SignupCountsByStateQueryDocument = gql`
    query SignupCountsByStateQuery {
  convention: conventionByRequestHost {
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
export function useSignupCountsByStateQuerySuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<SignupCountsByStateQueryData, SignupCountsByStateQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<SignupCountsByStateQueryData, SignupCountsByStateQueryVariables>(SignupCountsByStateQueryDocument, options);
        }
export type SignupCountsByStateQueryHookResult = ReturnType<typeof useSignupCountsByStateQuery>;
export type SignupCountsByStateQueryLazyQueryHookResult = ReturnType<typeof useSignupCountsByStateQueryLazyQuery>;
export type SignupCountsByStateQuerySuspenseQueryHookResult = ReturnType<typeof useSignupCountsByStateQuerySuspenseQuery>;
export type SignupCountsByStateQueryQueryResult = Apollo.QueryResult<SignupCountsByStateQueryData, SignupCountsByStateQueryVariables>;
export const SignupSpySignupChangesQueryDocument = gql`
    query SignupSpySignupChangesQuery($filters: SignupChangeFiltersInput, $page: Int, $perPage: Int, $sort: [SortInput!]) {
  convention: conventionByRequestHost {
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
export function useSignupSpySignupChangesQuerySuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<SignupSpySignupChangesQueryData, SignupSpySignupChangesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<SignupSpySignupChangesQueryData, SignupSpySignupChangesQueryVariables>(SignupSpySignupChangesQueryDocument, options);
        }
export type SignupSpySignupChangesQueryHookResult = ReturnType<typeof useSignupSpySignupChangesQuery>;
export type SignupSpySignupChangesQueryLazyQueryHookResult = ReturnType<typeof useSignupSpySignupChangesQueryLazyQuery>;
export type SignupSpySignupChangesQuerySuspenseQueryHookResult = ReturnType<typeof useSignupSpySignupChangesQuerySuspenseQuery>;
export type SignupSpySignupChangesQueryQueryResult = Apollo.QueryResult<SignupSpySignupChangesQueryData, SignupSpySignupChangesQueryVariables>;