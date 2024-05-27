/* eslint-disable */
import * as Types from '../graphqlTypes.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type SignupRoundsAdminQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type SignupRoundsAdminQueryData = { __typename: 'Query', convention: { __typename: 'Convention', id: string, signup_rounds: Array<{ __typename: 'SignupRound', id: string, maximum_event_signups: string, ranked_choice_order?: Types.RankedChoiceOrder | null, start?: string | null, executed_at?: string | null }> } };


export const SignupRoundsAdminQueryDocument = gql`
    query SignupRoundsAdminQuery {
  convention: conventionByRequestHost {
    id
    signup_rounds {
      id
      maximum_event_signups
      ranked_choice_order
      start
      executed_at
    }
  }
}
    `;

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