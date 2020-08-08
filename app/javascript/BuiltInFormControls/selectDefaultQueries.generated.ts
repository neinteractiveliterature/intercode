/* eslint-disable */
import * as Types from '../graphqlTypes.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';


export type DefaultEventsQueryQueryVariables = Types.Exact<{
  title?: Types.Maybe<Types.Scalars['String']>;
}>;


export type DefaultEventsQueryQuery = (
  { __typename?: 'Query' }
  & { convention?: Types.Maybe<(
    { __typename?: 'Convention' }
    & Pick<Types.Convention, 'id'>
    & { events_paginated: (
      { __typename?: 'EventsPagination' }
      & { entries: Array<(
        { __typename?: 'Event' }
        & Pick<Types.Event, 'id' | 'title'>
      )> }
    ) }
  )> }
);

export type DefaultUserConProfilesQueryQueryVariables = Types.Exact<{
  name?: Types.Maybe<Types.Scalars['String']>;
}>;


export type DefaultUserConProfilesQueryQuery = (
  { __typename?: 'Query' }
  & { convention?: Types.Maybe<(
    { __typename?: 'Convention' }
    & Pick<Types.Convention, 'id'>
    & { user_con_profiles_paginated: (
      { __typename?: 'UserConProfilesPagination' }
      & { entries: Array<(
        { __typename?: 'UserConProfile' }
        & Pick<Types.UserConProfile, 'id' | 'name_without_nickname' | 'email'>
      )> }
    ) }
  )> }
);

export type DefaultUsersQueryQueryVariables = Types.Exact<{
  name?: Types.Maybe<Types.Scalars['String']>;
}>;


export type DefaultUsersQueryQuery = (
  { __typename?: 'Query' }
  & { users_paginated: (
    { __typename?: 'UsersPagination' }
    & { entries: Array<(
      { __typename?: 'User' }
      & Pick<Types.User, 'id' | 'name' | 'email'>
    )> }
  ) }
);


export const DefaultEventsQueryDocument = gql`
    query DefaultEventsQuery($title: String) {
  convention {
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
 * __useDefaultEventsQueryQuery__
 *
 * To run a query within a React component, call `useDefaultEventsQueryQuery` and pass it any options that fit your needs.
 * When your component renders, `useDefaultEventsQueryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useDefaultEventsQueryQuery({
 *   variables: {
 *      title: // value for 'title'
 *   },
 * });
 */
export function useDefaultEventsQueryQuery(baseOptions?: Apollo.QueryHookOptions<DefaultEventsQueryQuery, DefaultEventsQueryQueryVariables>) {
        return Apollo.useQuery<DefaultEventsQueryQuery, DefaultEventsQueryQueryVariables>(DefaultEventsQueryDocument, baseOptions);
      }
export function useDefaultEventsQueryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<DefaultEventsQueryQuery, DefaultEventsQueryQueryVariables>) {
          return Apollo.useLazyQuery<DefaultEventsQueryQuery, DefaultEventsQueryQueryVariables>(DefaultEventsQueryDocument, baseOptions);
        }
export type DefaultEventsQueryQueryHookResult = ReturnType<typeof useDefaultEventsQueryQuery>;
export type DefaultEventsQueryLazyQueryHookResult = ReturnType<typeof useDefaultEventsQueryLazyQuery>;
export type DefaultEventsQueryQueryResult = Apollo.QueryResult<DefaultEventsQueryQuery, DefaultEventsQueryQueryVariables>;
export const DefaultUserConProfilesQueryDocument = gql`
    query DefaultUserConProfilesQuery($name: String) {
  convention {
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
 * __useDefaultUserConProfilesQueryQuery__
 *
 * To run a query within a React component, call `useDefaultUserConProfilesQueryQuery` and pass it any options that fit your needs.
 * When your component renders, `useDefaultUserConProfilesQueryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useDefaultUserConProfilesQueryQuery({
 *   variables: {
 *      name: // value for 'name'
 *   },
 * });
 */
export function useDefaultUserConProfilesQueryQuery(baseOptions?: Apollo.QueryHookOptions<DefaultUserConProfilesQueryQuery, DefaultUserConProfilesQueryQueryVariables>) {
        return Apollo.useQuery<DefaultUserConProfilesQueryQuery, DefaultUserConProfilesQueryQueryVariables>(DefaultUserConProfilesQueryDocument, baseOptions);
      }
export function useDefaultUserConProfilesQueryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<DefaultUserConProfilesQueryQuery, DefaultUserConProfilesQueryQueryVariables>) {
          return Apollo.useLazyQuery<DefaultUserConProfilesQueryQuery, DefaultUserConProfilesQueryQueryVariables>(DefaultUserConProfilesQueryDocument, baseOptions);
        }
export type DefaultUserConProfilesQueryQueryHookResult = ReturnType<typeof useDefaultUserConProfilesQueryQuery>;
export type DefaultUserConProfilesQueryLazyQueryHookResult = ReturnType<typeof useDefaultUserConProfilesQueryLazyQuery>;
export type DefaultUserConProfilesQueryQueryResult = Apollo.QueryResult<DefaultUserConProfilesQueryQuery, DefaultUserConProfilesQueryQueryVariables>;
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
 * __useDefaultUsersQueryQuery__
 *
 * To run a query within a React component, call `useDefaultUsersQueryQuery` and pass it any options that fit your needs.
 * When your component renders, `useDefaultUsersQueryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useDefaultUsersQueryQuery({
 *   variables: {
 *      name: // value for 'name'
 *   },
 * });
 */
export function useDefaultUsersQueryQuery(baseOptions?: Apollo.QueryHookOptions<DefaultUsersQueryQuery, DefaultUsersQueryQueryVariables>) {
        return Apollo.useQuery<DefaultUsersQueryQuery, DefaultUsersQueryQueryVariables>(DefaultUsersQueryDocument, baseOptions);
      }
export function useDefaultUsersQueryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<DefaultUsersQueryQuery, DefaultUsersQueryQueryVariables>) {
          return Apollo.useLazyQuery<DefaultUsersQueryQuery, DefaultUsersQueryQueryVariables>(DefaultUsersQueryDocument, baseOptions);
        }
export type DefaultUsersQueryQueryHookResult = ReturnType<typeof useDefaultUsersQueryQuery>;
export type DefaultUsersQueryLazyQueryHookResult = ReturnType<typeof useDefaultUsersQueryLazyQuery>;
export type DefaultUsersQueryQueryResult = Apollo.QueryResult<DefaultUsersQueryQuery, DefaultUsersQueryQueryVariables>;