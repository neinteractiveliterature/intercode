/* eslint-disable */
import * as Types from '../graphqlTypes.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions =  {}
export type CommonConventionDataFragment = { __typename: 'Convention', name: string, starts_at?: string | null | undefined, ends_at?: string | null | undefined, site_mode: Types.SiteMode, timezone_name?: string | null | undefined, timezone_mode: Types.TimezoneMode, ticket_name: string, ticket_mode: Types.TicketMode, id: string, event_categories: Array<{ __typename: 'EventCategory', name: string, scheduling_ui: Types.SchedulingUi, default_color?: string | null | undefined, full_color?: string | null | undefined, signed_up_color?: string | null | undefined, id: string }> };

export type RunBasicSignupDataFragment = { __typename: 'Run', signup_count_by_state_and_bucket_key_and_counted: string, id: string, my_signups: Array<{ __typename: 'Signup', state: Types.SignupState, id: string }>, my_signup_requests: Array<{ __typename: 'SignupRequest', state: Types.SignupRequestState, id: string }> };

export type CommonConventionDataQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type CommonConventionDataQueryData = { __typename: 'Query', convention: { __typename: 'Convention', name: string, starts_at?: string | null | undefined, ends_at?: string | null | undefined, site_mode: Types.SiteMode, timezone_name?: string | null | undefined, timezone_mode: Types.TimezoneMode, ticket_name: string, ticket_mode: Types.TicketMode, id: string, event_categories: Array<{ __typename: 'EventCategory', name: string, scheduling_ui: Types.SchedulingUi, default_color?: string | null | undefined, full_color?: string | null | undefined, signed_up_color?: string | null | undefined, id: string }> } };

export const CommonConventionDataFragmentDoc = gql`
    fragment CommonConventionData on Convention {
  id: transitionalId
  name
  starts_at
  ends_at
  site_mode
  timezone_name
  timezone_mode
  ticket_name
  ticket_mode
  event_categories {
    id: transitionalId
    name
    scheduling_ui
    default_color
    full_color
    signed_up_color
  }
}
    `;
export const RunBasicSignupDataFragmentDoc = gql`
    fragment RunBasicSignupData on Run {
  id: transitionalId
  signup_count_by_state_and_bucket_key_and_counted
  my_signups {
    id: transitionalId
    state
  }
  my_signup_requests {
    id: transitionalId
    state
  }
}
    `;
export const CommonConventionDataQueryDocument = gql`
    query CommonConventionDataQuery {
  convention: conventionByRequestHost {
    id: transitionalId
    ...CommonConventionData
  }
}
    ${CommonConventionDataFragmentDoc}`;

/**
 * __useCommonConventionDataQuery__
 *
 * To run a query within a React component, call `useCommonConventionDataQuery` and pass it any options that fit your needs.
 * When your component renders, `useCommonConventionDataQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCommonConventionDataQuery({
 *   variables: {
 *   },
 * });
 */
export function useCommonConventionDataQuery(baseOptions?: Apollo.QueryHookOptions<CommonConventionDataQueryData, CommonConventionDataQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<CommonConventionDataQueryData, CommonConventionDataQueryVariables>(CommonConventionDataQueryDocument, options);
      }
export function useCommonConventionDataQueryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<CommonConventionDataQueryData, CommonConventionDataQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<CommonConventionDataQueryData, CommonConventionDataQueryVariables>(CommonConventionDataQueryDocument, options);
        }
export type CommonConventionDataQueryHookResult = ReturnType<typeof useCommonConventionDataQuery>;
export type CommonConventionDataQueryLazyQueryHookResult = ReturnType<typeof useCommonConventionDataQueryLazyQuery>;
export type CommonConventionDataQueryQueryResult = Apollo.QueryResult<CommonConventionDataQueryData, CommonConventionDataQueryVariables>;