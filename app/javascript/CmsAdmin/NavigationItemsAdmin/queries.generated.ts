/* eslint-disable */
import * as Types from '../../graphqlTypes.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions =  {}
export type AdminNavigationItemFieldsFragment = { __typename: 'CmsNavigationItem', position?: number | null | undefined, title?: string | null | undefined, id: string, page?: { __typename: 'Page', id: string } | null | undefined, navigation_section?: { __typename: 'CmsNavigationItem', id: string } | null | undefined };

export type NavigationItemsAdminQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type NavigationItemsAdminQueryData = { __typename: 'Query', convention?: { __typename: 'Convention', name: string, id: string } | null | undefined, cmsParent: { __typename: 'Convention', id: string, cmsPages: Array<{ __typename: 'Page', name?: string | null | undefined, id: string }>, cmsNavigationItems: Array<{ __typename: 'CmsNavigationItem', position?: number | null | undefined, title?: string | null | undefined, id: string, page?: { __typename: 'Page', id: string } | null | undefined, navigation_section?: { __typename: 'CmsNavigationItem', id: string } | null | undefined }> } | { __typename: 'RootSite', id: string, cmsPages: Array<{ __typename: 'Page', name?: string | null | undefined, id: string }>, cmsNavigationItems: Array<{ __typename: 'CmsNavigationItem', position?: number | null | undefined, title?: string | null | undefined, id: string, page?: { __typename: 'Page', id: string } | null | undefined, navigation_section?: { __typename: 'CmsNavigationItem', id: string } | null | undefined }> } };

export const AdminNavigationItemFieldsFragmentDoc = gql`
    fragment AdminNavigationItemFields on CmsNavigationItem {
  id: transitionalId
  position
  title
  page {
    id: transitionalId
  }
  navigation_section {
    id: transitionalId
  }
}
    `;
export const NavigationItemsAdminQueryDocument = gql`
    query NavigationItemsAdminQuery {
  convention: conventionByRequestHostIfPresent {
    id: transitionalId
    name
  }
  cmsParent: cmsParentByRequestHost {
    id: transitionalId
    cmsPages {
      id: transitionalId
      name
    }
    cmsNavigationItems {
      id: transitionalId
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