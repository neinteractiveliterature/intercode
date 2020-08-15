/* eslint-disable */
import * as Types from '../../graphqlTypes.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';


export type AdminNavigationItemFieldsFragment = (
  { __typename?: 'CmsNavigationItem' }
  & Pick<Types.CmsNavigationItem, 'id' | 'position' | 'title'>
  & { page?: Types.Maybe<(
    { __typename?: 'Page' }
    & Pick<Types.Page, 'id'>
  )>, navigation_section?: Types.Maybe<(
    { __typename?: 'CmsNavigationItem' }
    & Pick<Types.CmsNavigationItem, 'id'>
  )> }
);

export type NavigationItemsAdminQueryQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type NavigationItemsAdminQueryQuery = (
  { __typename?: 'Query' }
  & { convention?: Types.Maybe<(
    { __typename?: 'Convention' }
    & Pick<Types.Convention, 'id' | 'name'>
  )>, cmsPages: Array<(
    { __typename?: 'Page' }
    & Pick<Types.Page, 'id' | 'name'>
  )>, cmsNavigationItems: Array<(
    { __typename?: 'CmsNavigationItem' }
    & Pick<Types.CmsNavigationItem, 'id'>
    & AdminNavigationItemFieldsFragment
  )> }
);

export const AdminNavigationItemFieldsFragmentDoc = gql`
    fragment AdminNavigationItemFields on CmsNavigationItem {
  id
  position
  title
  page {
    id
  }
  navigation_section {
    id
  }
}
    `;
export const NavigationItemsAdminQueryDocument = gql`
    query NavigationItemsAdminQuery {
  convention {
    id
    name
  }
  cmsPages {
    id
    name
  }
  cmsNavigationItems {
    id
    ...AdminNavigationItemFields
  }
}
    ${AdminNavigationItemFieldsFragmentDoc}`;

/**
 * __useNavigationItemsAdminQueryQuery__
 *
 * To run a query within a React component, call `useNavigationItemsAdminQueryQuery` and pass it any options that fit your needs.
 * When your component renders, `useNavigationItemsAdminQueryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useNavigationItemsAdminQueryQuery({
 *   variables: {
 *   },
 * });
 */
export function useNavigationItemsAdminQueryQuery(baseOptions?: Apollo.QueryHookOptions<NavigationItemsAdminQueryQuery, NavigationItemsAdminQueryQueryVariables>) {
        return Apollo.useQuery<NavigationItemsAdminQueryQuery, NavigationItemsAdminQueryQueryVariables>(NavigationItemsAdminQueryDocument, baseOptions);
      }
export function useNavigationItemsAdminQueryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<NavigationItemsAdminQueryQuery, NavigationItemsAdminQueryQueryVariables>) {
          return Apollo.useLazyQuery<NavigationItemsAdminQueryQuery, NavigationItemsAdminQueryQueryVariables>(NavigationItemsAdminQueryDocument, baseOptions);
        }
export type NavigationItemsAdminQueryQueryHookResult = ReturnType<typeof useNavigationItemsAdminQueryQuery>;
export type NavigationItemsAdminQueryLazyQueryHookResult = ReturnType<typeof useNavigationItemsAdminQueryLazyQuery>;
export type NavigationItemsAdminQueryQueryResult = Apollo.QueryResult<NavigationItemsAdminQueryQuery, NavigationItemsAdminQueryQueryVariables>;