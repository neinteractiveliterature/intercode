/* eslint-disable */
import * as Types from '../graphqlTypes.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type CmsPageQueryVariables = Types.Exact<{
  slug?: Types.InputMaybe<Types.Scalars['String']['input']>;
  rootPage?: Types.InputMaybe<Types.Scalars['Boolean']['input']>;
}>;


export type CmsPageQueryData = { __typename: 'Query', convention?: { __typename: 'Convention', id: string, name: string, clickwrap_agreement?: string | null, my_profile?: { __typename: 'UserConProfile', id: string, accepted_clickwrap_agreement?: boolean | null } | null } | null, cmsParent: { __typename: 'Convention', id: string, cmsPage: { __typename: 'Page', id: string, name?: string | null, content_html: string, current_ability_can_update: boolean, current_ability_can_delete: boolean, skip_clickwrap_agreement?: boolean | null } } | { __typename: 'RootSite', id: string, cmsPage: { __typename: 'Page', id: string, name?: string | null, content_html: string, current_ability_can_update: boolean, current_ability_can_delete: boolean, skip_clickwrap_agreement?: boolean | null } }, currentAbility: { __typename: 'Ability', can_manage_any_cms_content: boolean } };

export type PageAdminDropdownQueryVariables = Types.Exact<{
  id: Types.Scalars['ID']['input'];
}>;


export type PageAdminDropdownQueryData = { __typename: 'Query', cmsParent: { __typename: 'Convention', id: string, defaultLayout: { __typename: 'CmsLayout', id: string, name?: string | null }, cmsPage: { __typename: 'Page', id: string, cms_layout?: { __typename: 'CmsLayout', id: string, name?: string | null } | null, referenced_partials: Array<{ __typename: 'CmsPartial', id: string, name?: string | null }> } } | { __typename: 'RootSite', id: string, root_site_default_layout: { __typename: 'CmsLayout', id: string, name?: string | null }, cmsPage: { __typename: 'Page', id: string, cms_layout?: { __typename: 'CmsLayout', id: string, name?: string | null } | null, referenced_partials: Array<{ __typename: 'CmsPartial', id: string, name?: string | null }> } } };


export const CmsPageQueryDocument = gql`
    query CmsPageQuery($slug: String, $rootPage: Boolean) {
  convention: conventionByRequestHostIfPresent {
    id
    name
    clickwrap_agreement
    my_profile {
      id
      accepted_clickwrap_agreement
    }
  }
  cmsParent: cmsParentByRequestHost {
    id
    cmsPage(slug: $slug, rootPage: $rootPage) {
      id
      name
      content_html
      current_ability_can_update
      current_ability_can_delete
      skip_clickwrap_agreement
    }
  }
  currentAbility {
    can_manage_any_cms_content
  }
}
    `;

/**
 * __useCmsPageQuery__
 *
 * To run a query within a React component, call `useCmsPageQuery` and pass it any options that fit your needs.
 * When your component renders, `useCmsPageQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCmsPageQuery({
 *   variables: {
 *      slug: // value for 'slug'
 *      rootPage: // value for 'rootPage'
 *   },
 * });
 */
export function useCmsPageQuery(baseOptions?: Apollo.QueryHookOptions<CmsPageQueryData, CmsPageQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<CmsPageQueryData, CmsPageQueryVariables>(CmsPageQueryDocument, options);
      }
export function useCmsPageQueryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<CmsPageQueryData, CmsPageQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<CmsPageQueryData, CmsPageQueryVariables>(CmsPageQueryDocument, options);
        }
export function useCmsPageQuerySuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<CmsPageQueryData, CmsPageQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<CmsPageQueryData, CmsPageQueryVariables>(CmsPageQueryDocument, options);
        }
export type CmsPageQueryHookResult = ReturnType<typeof useCmsPageQuery>;
export type CmsPageQueryLazyQueryHookResult = ReturnType<typeof useCmsPageQueryLazyQuery>;
export type CmsPageQuerySuspenseQueryHookResult = ReturnType<typeof useCmsPageQuerySuspenseQuery>;
export type CmsPageQueryQueryResult = Apollo.QueryResult<CmsPageQueryData, CmsPageQueryVariables>;
export const PageAdminDropdownQueryDocument = gql`
    query PageAdminDropdownQuery($id: ID!) {
  cmsParent: cmsParentByRequestHost {
    id
    cmsPage(id: $id) {
      id
      cms_layout {
        id
        name
      }
      referenced_partials {
        id
        name
      }
    }
    ... on Convention {
      defaultLayout {
        id
        name
      }
    }
    ... on RootSite {
      root_site_default_layout: defaultLayout {
        id
        name
      }
    }
  }
}
    `;

/**
 * __usePageAdminDropdownQuery__
 *
 * To run a query within a React component, call `usePageAdminDropdownQuery` and pass it any options that fit your needs.
 * When your component renders, `usePageAdminDropdownQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = usePageAdminDropdownQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function usePageAdminDropdownQuery(baseOptions: Apollo.QueryHookOptions<PageAdminDropdownQueryData, PageAdminDropdownQueryVariables> & ({ variables: PageAdminDropdownQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<PageAdminDropdownQueryData, PageAdminDropdownQueryVariables>(PageAdminDropdownQueryDocument, options);
      }
export function usePageAdminDropdownQueryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<PageAdminDropdownQueryData, PageAdminDropdownQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<PageAdminDropdownQueryData, PageAdminDropdownQueryVariables>(PageAdminDropdownQueryDocument, options);
        }
export function usePageAdminDropdownQuerySuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<PageAdminDropdownQueryData, PageAdminDropdownQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<PageAdminDropdownQueryData, PageAdminDropdownQueryVariables>(PageAdminDropdownQueryDocument, options);
        }
export type PageAdminDropdownQueryHookResult = ReturnType<typeof usePageAdminDropdownQuery>;
export type PageAdminDropdownQueryLazyQueryHookResult = ReturnType<typeof usePageAdminDropdownQueryLazyQuery>;
export type PageAdminDropdownQuerySuspenseQueryHookResult = ReturnType<typeof usePageAdminDropdownQuerySuspenseQuery>;
export type PageAdminDropdownQueryQueryResult = Apollo.QueryResult<PageAdminDropdownQueryData, PageAdminDropdownQueryVariables>;