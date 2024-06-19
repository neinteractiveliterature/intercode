/* eslint-disable */
import * as Types from '../graphqlTypes.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type SignupRoundFieldsFragment = { __typename: 'SignupRound', id: string, maximum_event_signups: string, ranked_choice_order?: Types.RankedChoiceOrder | null, start?: string | null, executed_at?: string | null };

export type SignupRoundsAdminQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type SignupRoundsAdminQueryData = { __typename: 'Query', convention: { __typename: 'Convention', id: string, signup_rounds: Array<{ __typename: 'SignupRound', id: string, maximum_event_signups: string, ranked_choice_order?: Types.RankedChoiceOrder | null, start?: string | null, executed_at?: string | null }> } };

export type SignupRoundRankedChoiceDecisionsTableQueryVariables = Types.Exact<{
  signupRoundId: Types.Scalars['ID']['input'];
  page?: Types.InputMaybe<Types.Scalars['Int']['input']>;
  perPage?: Types.InputMaybe<Types.Scalars['Int']['input']>;
  filters?: Types.InputMaybe<Types.RankedChoiceDecisionFiltersInput>;
  sort?: Types.InputMaybe<Array<Types.SortInput> | Types.SortInput>;
}>;


export type SignupRoundRankedChoiceDecisionsTableQueryData = { __typename: 'Query', convention: { __typename: 'Convention', id: string, signup_round: { __typename: 'SignupRound', id: string, ranked_choice_decisions_paginated: { __typename: 'RankedChoiceDecisionsPagination', total_pages: number, entries: Array<{ __typename: 'RankedChoiceDecision', id: string, created_at: string, decision: Types.RankedChoiceDecisionValue, reason?: Types.RankedChoiceDecisionReason | null, user_con_profile?: { __typename: 'UserConProfile', id: string, name_without_nickname: string } | null, signup_ranked_choice?: { __typename: 'SignupRankedChoice', id: string, priority: number, requested_bucket_key?: string | null, state: Types.SignupRankedChoiceState, target_run: { __typename: 'Run', id: string, starts_at: string, title_suffix?: string | null, event: { __typename: 'Event', id: string, title?: string | null } } } | null }> } } } };

export const SignupRoundFieldsFragmentDoc = gql`
    fragment SignupRoundFields on SignupRound {
  id
  maximum_event_signups
  ranked_choice_order
  start
  executed_at
}
    `;
export const SignupRoundsAdminQueryDocument = gql`
    query SignupRoundsAdminQuery {
  convention: conventionByRequestHost {
    id
    signup_rounds {
      id
      ...SignupRoundFields
    }
  }
}
    ${SignupRoundFieldsFragmentDoc}`;

/**
 * __useSignupRoundsAdminQuery__
 *
 * To run a query within a React component, call `useSignupRoundsAdminQuery` and pass it any options that fit your needs.
 * When your component renders, `useSignupRoundsAdminQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSignupRoundsAdminQuery({
 *   variables: {
 *   },
 * });
 */
export function useSignupRoundsAdminQuery(baseOptions?: Apollo.QueryHookOptions<SignupRoundsAdminQueryData, SignupRoundsAdminQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<SignupRoundsAdminQueryData, SignupRoundsAdminQueryVariables>(SignupRoundsAdminQueryDocument, options);
      }
export function useSignupRoundsAdminQueryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SignupRoundsAdminQueryData, SignupRoundsAdminQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<SignupRoundsAdminQueryData, SignupRoundsAdminQueryVariables>(SignupRoundsAdminQueryDocument, options);
        }
export function useSignupRoundsAdminQuerySuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<SignupRoundsAdminQueryData, SignupRoundsAdminQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<SignupRoundsAdminQueryData, SignupRoundsAdminQueryVariables>(SignupRoundsAdminQueryDocument, options);
        }
export type SignupRoundsAdminQueryHookResult = ReturnType<typeof useSignupRoundsAdminQuery>;
export type SignupRoundsAdminQueryLazyQueryHookResult = ReturnType<typeof useSignupRoundsAdminQueryLazyQuery>;
export type SignupRoundsAdminQuerySuspenseQueryHookResult = ReturnType<typeof useSignupRoundsAdminQuerySuspenseQuery>;
export type SignupRoundsAdminQueryQueryResult = Apollo.QueryResult<SignupRoundsAdminQueryData, SignupRoundsAdminQueryVariables>;
export const SignupRoundRankedChoiceDecisionsTableQueryDocument = gql`
    query SignupRoundRankedChoiceDecisionsTableQuery($signupRoundId: ID!, $page: Int, $perPage: Int, $filters: RankedChoiceDecisionFiltersInput, $sort: [SortInput!]) {
  convention: conventionByRequestHost {
    id
    signup_round(id: $signupRoundId) {
      id
      ranked_choice_decisions_paginated(
        page: $page
        per_page: $perPage
        filters: $filters
        sort: $sort
      ) {
        total_pages
        entries {
          id
          created_at
          decision
          reason
          user_con_profile {
            id
            name_without_nickname
          }
          signup_ranked_choice {
            id
            priority
            requested_bucket_key
            state
            target_run {
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
  }
}
    `;

/**
 * __useSignupRoundRankedChoiceDecisionsTableQuery__
 *
 * To run a query within a React component, call `useSignupRoundRankedChoiceDecisionsTableQuery` and pass it any options that fit your needs.
 * When your component renders, `useSignupRoundRankedChoiceDecisionsTableQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSignupRoundRankedChoiceDecisionsTableQuery({
 *   variables: {
 *      signupRoundId: // value for 'signupRoundId'
 *      page: // value for 'page'
 *      perPage: // value for 'perPage'
 *      filters: // value for 'filters'
 *      sort: // value for 'sort'
 *   },
 * });
 */
export function useSignupRoundRankedChoiceDecisionsTableQuery(baseOptions: Apollo.QueryHookOptions<SignupRoundRankedChoiceDecisionsTableQueryData, SignupRoundRankedChoiceDecisionsTableQueryVariables> & ({ variables: SignupRoundRankedChoiceDecisionsTableQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<SignupRoundRankedChoiceDecisionsTableQueryData, SignupRoundRankedChoiceDecisionsTableQueryVariables>(SignupRoundRankedChoiceDecisionsTableQueryDocument, options);
      }
export function useSignupRoundRankedChoiceDecisionsTableQueryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SignupRoundRankedChoiceDecisionsTableQueryData, SignupRoundRankedChoiceDecisionsTableQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<SignupRoundRankedChoiceDecisionsTableQueryData, SignupRoundRankedChoiceDecisionsTableQueryVariables>(SignupRoundRankedChoiceDecisionsTableQueryDocument, options);
        }
export function useSignupRoundRankedChoiceDecisionsTableQuerySuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<SignupRoundRankedChoiceDecisionsTableQueryData, SignupRoundRankedChoiceDecisionsTableQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<SignupRoundRankedChoiceDecisionsTableQueryData, SignupRoundRankedChoiceDecisionsTableQueryVariables>(SignupRoundRankedChoiceDecisionsTableQueryDocument, options);
        }
export type SignupRoundRankedChoiceDecisionsTableQueryHookResult = ReturnType<typeof useSignupRoundRankedChoiceDecisionsTableQuery>;
export type SignupRoundRankedChoiceDecisionsTableQueryLazyQueryHookResult = ReturnType<typeof useSignupRoundRankedChoiceDecisionsTableQueryLazyQuery>;
export type SignupRoundRankedChoiceDecisionsTableQuerySuspenseQueryHookResult = ReturnType<typeof useSignupRoundRankedChoiceDecisionsTableQuerySuspenseQuery>;
export type SignupRoundRankedChoiceDecisionsTableQueryQueryResult = Apollo.QueryResult<SignupRoundRankedChoiceDecisionsTableQueryData, SignupRoundRankedChoiceDecisionsTableQueryVariables>;