/* eslint-disable */
import * as Types from '../graphqlTypes.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions =  {}
export type DefaultEventsQueryVariables = Types.Exact<{
  title?: Types.Maybe<Types.Scalars['String']>;
}>;


export type DefaultEventsQueryData = { __typename: 'Query', convention: { __typename: 'Convention', id: string, events_paginated: { __typename: 'EventsPagination', entries: Array<{ __typename: 'Event', id: string, title?: string | null | undefined }> } } };

export type DefaultUserConProfilesQueryVariables = Types.Exact<{
  name?: Types.Maybe<Types.Scalars['String']>;
}>;


export type DefaultUserConProfilesQueryData = { __typename: 'Query', convention: { __typename: 'Convention', id: string, user_con_profiles_paginated: { __typename: 'UserConProfilesPagination', entries: Array<{ __typename: 'UserConProfile', id: string, name_without_nickname: string, email?: string | null | undefined }> } } };

export type DefaultUsersQueryVariables = Types.Exact<{
  name?: Types.Maybe<Types.Scalars['String']>;
}>;


export type DefaultUsersQueryData = { __typename: 'Query', users_paginated: { __typename: 'UsersPagination', entries: Array<{ __typename: 'User', id: string, name?: string | null | undefined, email?: string | null | undefined }> } };


export const DefaultEventsQueryDocument = gql`
    query DefaultEventsQuery($title: String) {
  convention: conventionByRequestHost {
    id
    events_paginated(filters: {title: $title}, per_page: 50) {
      entries {
        id
        title
      }
    }
  }
}
    `;

/**
 * __useDefaultEventsQuery__
 *
 * To run a query within a React component, call `useDefaultEventsQuery` and pass it any options that fit your needs.
 * When your component renders, `useDefaultEventsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useDefaultEventsQuery({
 *   variables: {
 *      title: // value for 'title'
 *   },
 * });
 */
export function useDefaultEventsQuery(baseOptions?: Apollo.QueryHookOptions<DefaultEventsQueryData, DefaultEventsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<DefaultEventsQueryData, DefaultEventsQueryVariables>(DefaultEventsQueryDocument, options);
      }
export function useDefaultEventsQueryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<DefaultEventsQueryData, DefaultEventsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<DefaultEventsQueryData, DefaultEventsQueryVariables>(DefaultEventsQueryDocument, options);
        }
export type DefaultEventsQueryHookResult = ReturnType<typeof useDefaultEventsQuery>;
export type DefaultEventsQueryLazyQueryHookResult = ReturnType<typeof useDefaultEventsQueryLazyQuery>;
export type DefaultEventsQueryQueryResult = Apollo.QueryResult<DefaultEventsQueryData, DefaultEventsQueryVariables>;
export const DefaultUserConProfilesQueryDocument = gql`
    query DefaultUserConProfilesQuery($name: String) {
  convention: conventionByRequestHost {
    id
    user_con_profiles_paginated(filters: {name: $name}, per_page: 50) {
      entries {
        id
        name_without_nickname
        email
      }
    }
  }
}
    `;

/**
 * __useDefaultUserConProfilesQuery__
 *
 * To run a query within a React component, call `useDefaultUserConProfilesQuery` and pass it any options that fit your needs.
 * When your component renders, `useDefaultUserConProfilesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useDefaultUserConProfilesQuery({
 *   variables: {
 *      name: // value for 'name'
 *   },
 * });
 */
export function useDefaultUserConProfilesQuery(baseOptions?: Apollo.QueryHookOptions<DefaultUserConProfilesQueryData, DefaultUserConProfilesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<DefaultUserConProfilesQueryData, DefaultUserConProfilesQueryVariables>(DefaultUserConProfilesQueryDocument, options);
      }
export function useDefaultUserConProfilesQueryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<DefaultUserConProfilesQueryData, DefaultUserConProfilesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<DefaultUserConProfilesQueryData, DefaultUserConProfilesQueryVariables>(DefaultUserConProfilesQueryDocument, options);
        }
export type DefaultUserConProfilesQueryHookResult = ReturnType<typeof useDefaultUserConProfilesQuery>;
export type DefaultUserConProfilesQueryLazyQueryHookResult = ReturnType<typeof useDefaultUserConProfilesQueryLazyQuery>;
export type DefaultUserConProfilesQueryQueryResult = Apollo.QueryResult<DefaultUserConProfilesQueryData, DefaultUserConProfilesQueryVariables>;
export const DefaultUsersQueryDocument = gql`
    query DefaultUsersQuery($name: String) {
  users_paginated(filters: {name: $name}, per_page: 50) {
    entries {
      id
      name
      email
    }
  }
}
    `;

/**
 * __useDefaultUsersQuery__
 *
 * To run a query within a React component, call `useDefaultUsersQuery` and pass it any options that fit your needs.
 * When your component renders, `useDefaultUsersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useDefaultUsersQuery({
 *   variables: {
 *      name: // value for 'name'
 *   },
 * });
 */
export function useDefaultUsersQuery(baseOptions?: Apollo.QueryHookOptions<DefaultUsersQueryData, DefaultUsersQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<DefaultUsersQueryData, DefaultUsersQueryVariables>(DefaultUsersQueryDocument, options);
      }
export function useDefaultUsersQueryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<DefaultUsersQueryData, DefaultUsersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<DefaultUsersQueryData, DefaultUsersQueryVariables>(DefaultUsersQueryDocument, options);
        }
export type DefaultUsersQueryHookResult = ReturnType<typeof useDefaultUsersQuery>;
export type DefaultUsersQueryLazyQueryHookResult = ReturnType<typeof useDefaultUsersQueryLazyQuery>;
export type DefaultUsersQueryQueryResult = Apollo.QueryResult<DefaultUsersQueryData, DefaultUsersQueryVariables>;