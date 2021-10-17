/* eslint-disable */
import * as Types from '../graphqlTypes.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions =  {}
export type CmsPageQueryVariables = Types.Exact<{
  slug?: Types.Maybe<Types.Scalars['String']>;
  rootPage?: Types.Maybe<Types.Scalars['Boolean']>;
}>;


export type CmsPageQueryData = { __typename: 'Query', convention?: { __typename: 'Convention', name: string, clickwrap_agreement?: string | null | undefined, id: string, my_profile?: { __typename: 'UserConProfile', accepted_clickwrap_agreement?: boolean | null | undefined, id: string } | null | undefined } | null | undefined, cmsParent: { __typename: 'Convention', id: string, cmsPage: { __typename: 'Page', name?: string | null | undefined, content_html: string, current_ability_can_update: boolean, current_ability_can_delete: boolean, skip_clickwrap_agreement?: boolean | null | undefined, id: string } } | { __typename: 'RootSite', id: string, cmsPage: { __typename: 'Page', name?: string | null | undefined, content_html: string, current_ability_can_update: boolean, current_ability_can_delete: boolean, skip_clickwrap_agreement?: boolean | null | undefined, id: string } }, currentAbility: { __typename: 'Ability', can_manage_any_cms_content: boolean } };

export type PageAdminDropdownQueryVariables = Types.Exact<{
  id: Types.Scalars['ID'];
}>;


export type PageAdminDropdownQueryData = { __typename: 'Query', cmsParent: { __typename: 'Convention', id: string, defaultLayout: { __typename: 'CmsLayout', name?: string | null | undefined, id: string }, cmsPage: { __typename: 'Page', id: string, cms_layout?: { __typename: 'CmsLayout', name?: string | null | undefined, id: string } | null | undefined, referenced_partials: Array<{ __typename: 'CmsPartial', name?: string | null | undefined, id: string }> } } | { __typename: 'RootSite', id: string, root_site_default_layout: { __typename: 'CmsLayout', name?: string | null | undefined, id: string }, cmsPage: { __typename: 'Page', id: string, cms_layout?: { __typename: 'CmsLayout', name?: string | null | undefined, id: string } | null | undefined, referenced_partials: Array<{ __typename: 'CmsPartial', name?: string | null | undefined, id: string }> } } };


export const CmsPageQueryDocument = gql`
    query CmsPageQuery($slug: String, $rootPage: Boolean) {
  convention: conventionByRequestHostIfPresent {
    id: transitionalId
    name
    clickwrap_agreement
    my_profile {
      id: transitionalId
      accepted_clickwrap_agreement
    }
  }
  cmsParent: cmsParentByRequestHost {
    id: transitionalId
    cmsPage(slug: $slug, rootPage: $rootPage) {
      id: transitionalId
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
export type CmsPageQueryHookResult = ReturnType<typeof useCmsPageQuery>;
export type CmsPageQueryLazyQueryHookResult = ReturnType<typeof useCmsPageQueryLazyQuery>;
export type CmsPageQueryQueryResult = Apollo.QueryResult<CmsPageQueryData, CmsPageQueryVariables>;
export const PageAdminDropdownQueryDocument = gql`
    query PageAdminDropdownQuery($id: ID!) {
  cmsParent: cmsParentByRequestHost {
    id: transitionalId
    cmsPage(transitionalId: $id) {
      id: transitionalId
      cms_layout {
        id: transitionalId
        name
      }
      referenced_partials {
        id: transitionalId
        name
      }
    }
    ... on Convention {
      defaultLayout {
        id: transitionalId
        name
      }
    }
    ... on RootSite {
      root_site_default_layout: defaultLayout {
        id: transitionalId
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
export function usePageAdminDropdownQuery(baseOptions: Apollo.QueryHookOptions<PageAdminDropdownQueryData, PageAdminDropdownQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<PageAdminDropdownQueryData, PageAdminDropdownQueryVariables>(PageAdminDropdownQueryDocument, options);
      }
export function usePageAdminDropdownQueryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<PageAdminDropdownQueryData, PageAdminDropdownQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<PageAdminDropdownQueryData, PageAdminDropdownQueryVariables>(PageAdminDropdownQueryDocument, options);
        }
export type PageAdminDropdownQueryHookResult = ReturnType<typeof usePageAdminDropdownQuery>;
export type PageAdminDropdownQueryLazyQueryHookResult = ReturnType<typeof usePageAdminDropdownQueryLazyQuery>;
export type PageAdminDropdownQueryQueryResult = Apollo.QueryResult<PageAdminDropdownQueryData, PageAdminDropdownQueryVariables>;