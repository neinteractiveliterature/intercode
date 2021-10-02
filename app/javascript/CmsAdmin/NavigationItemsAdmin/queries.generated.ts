/* eslint-disable */
import * as Types from '../../graphqlTypes.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions =  {}
export type AdminNavigationItemFieldsFragment = { __typename: 'CmsNavigationItem', id: number, position?: number | null | undefined, title?: string | null | undefined, page?: { __typename: 'Page', id: number } | null | undefined, navigation_section?: { __typename: 'CmsNavigationItem', id: number } | null | undefined };

export type NavigationItemsAdminQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type NavigationItemsAdminQueryData = { __typename: 'Query', convention?: { __typename: 'Convention', id: number, name: string } | null | undefined, cmsParent: { __typename: 'Convention', id: number, cmsPages: Array<{ __typename: 'Page', id: number, name?: string | null | undefined }>, cmsNavigationItems: Array<{ __typename: 'CmsNavigationItem', id: number, position?: number | null | undefined, title?: string | null | undefined, page?: { __typename: 'Page', id: number } | null | undefined, navigation_section?: { __typename: 'CmsNavigationItem', id: number } | null | undefined }> } | { __typename: 'RootSite', id: number, cmsPages: Array<{ __typename: 'Page', id: number, name?: string | null | undefined }>, cmsNavigationItems: Array<{ __typename: 'CmsNavigationItem', id: number, position?: number | null | undefined, title?: string | null | undefined, page?: { __typename: 'Page', id: number } | null | undefined, navigation_section?: { __typename: 'CmsNavigationItem', id: number } | null | undefined }> } };

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
  convention: conventionByRequestHostIfPresent {
    id
    name
  }
  cmsParent: cmsParentByRequestHost {
    id
    cmsPages {
      id
      name
    }
    cmsNavigationItems {
      id
      ...AdminNavigationItemFields
    }
  }
}
    ${AdminNavigationItemFieldsFragmentDoc}`;

/**
 * __useNavigationItemsAdminQuery__
 *
 * To run a query within a React component, call `useNavigationItemsAdminQuery` and pass it any options that fit your needs.
 * When your component renders, `useNavigationItemsAdminQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useNavigationItemsAdminQuery({
 *   variables: {
 *   },
 * });
 */
export function useNavigationItemsAdminQuery(baseOptions?: Apollo.QueryHookOptions<NavigationItemsAdminQueryData, NavigationItemsAdminQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<NavigationItemsAdminQueryData, NavigationItemsAdminQueryVariables>(NavigationItemsAdminQueryDocument, options);
      }
export function useNavigationItemsAdminQueryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<NavigationItemsAdminQueryData, NavigationItemsAdminQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<NavigationItemsAdminQueryData, NavigationItemsAdminQueryVariables>(NavigationItemsAdminQueryDocument, options);
        }
export type NavigationItemsAdminQueryHookResult = ReturnType<typeof useNavigationItemsAdminQuery>;
export type NavigationItemsAdminQueryLazyQueryHookResult = ReturnType<typeof useNavigationItemsAdminQueryLazyQuery>;
export type NavigationItemsAdminQueryQueryResult = Apollo.QueryResult<NavigationItemsAdminQueryData, NavigationItemsAdminQueryVariables>;