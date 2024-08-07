/* eslint-disable */
import * as Types from '../../graphqlTypes.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type RankedChoiceUserConstraintFieldsFragment = { __typename: 'RankedChoiceUserConstraint', id: string, start?: string | null, finish?: string | null, maximum_signups: number };

export type UserConProfileRankedChoiceQueueFieldsFragment = { __typename: 'UserConProfile', id: string, ranked_choice_allow_waitlist: boolean, ranked_choice_user_constraints: Array<{ __typename: 'RankedChoiceUserConstraint', id: string, start?: string | null, finish?: string | null, maximum_signups: number }>, ticket?: { __typename: 'Ticket', id: string, ticket_type: { __typename: 'TicketType', id: string, allows_event_signups: boolean } } | null, signups: Array<{ __typename: 'Signup', id: string, state: Types.SignupState, counted: boolean, run: { __typename: 'Run', id: string, starts_at: string, ends_at: string } }>, signup_ranked_choices: Array<{ __typename: 'SignupRankedChoice', id: string, state: Types.SignupRankedChoiceState, priority: number, requested_bucket_key?: string | null, target_run: { __typename: 'Run', id: string, title_suffix?: string | null, starts_at: string, event: { __typename: 'Event', id: string, title?: string | null, length_seconds: number, event_category: { __typename: 'EventCategory', id: string, name: string }, registration_policy?: { __typename: 'RegistrationPolicy', buckets: Array<{ __typename: 'RegistrationPolicyBucket', key: string, name?: string | null, description?: string | null }> } | null } } }> };

export type MySignupQueueQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type MySignupQueueQueryData = { __typename: 'Query', convention: { __typename: 'Convention', id: string, signup_rounds: Array<{ __typename: 'SignupRound', id: string, start?: string | null, maximum_event_signups: string }>, my_profile?: { __typename: 'UserConProfile', id: string, ranked_choice_allow_waitlist: boolean, ranked_choice_user_constraints: Array<{ __typename: 'RankedChoiceUserConstraint', id: string, start?: string | null, finish?: string | null, maximum_signups: number }>, ticket?: { __typename: 'Ticket', id: string, ticket_type: { __typename: 'TicketType', id: string, allows_event_signups: boolean } } | null, signups: Array<{ __typename: 'Signup', id: string, state: Types.SignupState, counted: boolean, run: { __typename: 'Run', id: string, starts_at: string, ends_at: string } }>, signup_ranked_choices: Array<{ __typename: 'SignupRankedChoice', id: string, state: Types.SignupRankedChoiceState, priority: number, requested_bucket_key?: string | null, target_run: { __typename: 'Run', id: string, title_suffix?: string | null, starts_at: string, event: { __typename: 'Event', id: string, title?: string | null, length_seconds: number, event_category: { __typename: 'EventCategory', id: string, name: string }, registration_policy?: { __typename: 'RegistrationPolicy', buckets: Array<{ __typename: 'RegistrationPolicyBucket', key: string, name?: string | null, description?: string | null }> } | null } } }> } | null } };

export const RankedChoiceUserConstraintFieldsFragmentDoc = gql`
    fragment RankedChoiceUserConstraintFields on RankedChoiceUserConstraint {
  id
  start
  finish
  maximum_signups
}
    `;
export const UserConProfileRankedChoiceQueueFieldsFragmentDoc = gql`
    fragment UserConProfileRankedChoiceQueueFields on UserConProfile {
  id
  ranked_choice_allow_waitlist
  ranked_choice_user_constraints {
    id
    ...RankedChoiceUserConstraintFields
  }
  ticket {
    id
    ticket_type {
      id
      allows_event_signups
    }
  }
  signups {
    id
    state
    counted
    run {
      id
      starts_at
      ends_at
    }
  }
  signup_ranked_choices {
    id
    state
    priority
    requested_bucket_key
    target_run {
      id
      title_suffix
      starts_at
      event {
        id
        title
        length_seconds
        event_category {
          id
          name
        }
        registration_policy {
          buckets {
            key
            name
            description
          }
        }
      }
    }
  }
}
    ${RankedChoiceUserConstraintFieldsFragmentDoc}`;
export const MySignupQueueQueryDocument = gql`
    query MySignupQueueQuery {
  convention: conventionByRequestHost {
    id
    signup_rounds {
      id
      start
      maximum_event_signups
    }
    my_profile {
      id
      ...UserConProfileRankedChoiceQueueFields
    }
  }
}
    ${UserConProfileRankedChoiceQueueFieldsFragmentDoc}`;

/**
 * __useMySignupQueueQuery__
 *
 * To run a query within a React component, call `useMySignupQueueQuery` and pass it any options that fit your needs.
 * When your component renders, `useMySignupQueueQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMySignupQueueQuery({
 *   variables: {
 *   },
 * });
 */
export function useMySignupQueueQuery(baseOptions?: Apollo.QueryHookOptions<MySignupQueueQueryData, MySignupQueueQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<MySignupQueueQueryData, MySignupQueueQueryVariables>(MySignupQueueQueryDocument, options);
      }
export function useMySignupQueueQueryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MySignupQueueQueryData, MySignupQueueQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<MySignupQueueQueryData, MySignupQueueQueryVariables>(MySignupQueueQueryDocument, options);
        }
export function useMySignupQueueQuerySuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<MySignupQueueQueryData, MySignupQueueQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<MySignupQueueQueryData, MySignupQueueQueryVariables>(MySignupQueueQueryDocument, options);
        }
export type MySignupQueueQueryHookResult = ReturnType<typeof useMySignupQueueQuery>;
export type MySignupQueueQueryLazyQueryHookResult = ReturnType<typeof useMySignupQueueQueryLazyQuery>;
export type MySignupQueueQuerySuspenseQueryHookResult = ReturnType<typeof useMySignupQueueQuerySuspenseQuery>;
export type MySignupQueueQueryQueryResult = Apollo.QueryResult<MySignupQueueQueryData, MySignupQueueQueryVariables>;