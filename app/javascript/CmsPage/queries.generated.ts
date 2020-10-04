/* eslint-disable */
import * as Types from '../graphqlTypes.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type CmsPageQueryQueryVariables = Types.Exact<{
  slug?: Types.Maybe<Types.Scalars['String']>;
  rootPage?: Types.Maybe<Types.Scalars['Boolean']>;
}>;


export type CmsPageQueryQuery = (
  { __typename: 'Query' }
  & { convention?: Types.Maybe<(
    { __typename: 'Convention' }
    & Pick<Types.Convention, 'id' | 'name' | 'clickwrap_agreement'>
  )>, currentAbility: (
    { __typename: 'Ability' }
    & Pick<Types.Ability, 'can_manage_any_cms_content'>
  ), myProfile?: Types.Maybe<(
    { __typename: 'UserConProfile' }
    & Pick<Types.UserConProfile, 'id' | 'accepted_clickwrap_agreement'>
  )>, cmsPage: (
    { __typename: 'Page' }
    & Pick<Types.Page, 'id' | 'name' | 'content_html' | 'current_ability_can_update' | 'current_ability_can_delete' | 'skip_clickwrap_agreement'>
  ) }
);

export type PageAdminDropdownQueryQueryVariables = Types.Exact<{
  id: Types.Scalars['Int'];
}>;


export type PageAdminDropdownQueryQuery = (
  { __typename: 'Query' }
  & { cmsParent: (
    { __typename: 'Convention' }
    & Pick<Types.Convention, 'id'>
    & { default_layout?: Types.Maybe<(
      { __typename: 'CmsLayout' }
      & Pick<Types.CmsLayout, 'id' | 'name'>
    )> }
  ) | (
    { __typename: 'RootSite' }
    & Pick<Types.RootSite, 'id'>
    & { root_site_default_layout: (
      { __typename: 'CmsLayout' }
      & Pick<Types.CmsLayout, 'id' | 'name'>
    ) }
  ), cmsPage: (
    { __typename: 'Page' }
    & Pick<Types.Page, 'id'>
    & { cms_layout?: Types.Maybe<(
      { __typename: 'CmsLayout' }
      & Pick<Types.CmsLayout, 'id' | 'name'>
    )>, referenced_partials: Array<(
      { __typename: 'CmsPartial' }
      & Pick<Types.CmsPartial, 'id' | 'name'>
    )> }
  ) }
);


export const CmsPageQueryDocument = gql`
    query CmsPageQuery($slug: String, $rootPage: Boolean) {
  convention {
    id
    name
    clickwrap_agreement
  }
  currentAbility {
    can_manage_any_cms_content
  }
  myProfile {
    id
    accepted_clickwrap_agreement
  }
  cmsPage(slug: $slug, rootPage: $rootPage) {
    id
    name
    content_html
    current_ability_can_update
    current_ability_can_delete
    skip_clickwrap_agreement
  }
}
    `;

/**
 * __useCmsPageQueryQuery__
 *
 * To run a query within a React component, call `useCmsPageQueryQuery` and pass it any options that fit your needs.
 * When your component renders, `useCmsPageQueryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCmsPageQueryQuery({
 *   variables: {
 *      slug: // value for 'slug'
 *      rootPage: // value for 'rootPage'
 *   },
 * });
 */
export function useCmsPageQueryQuery(baseOptions?: Apollo.QueryHookOptions<CmsPageQueryQuery, CmsPageQueryQueryVariables>) {
        return Apollo.useQuery<CmsPageQueryQuery, CmsPageQueryQueryVariables>(CmsPageQueryDocument, baseOptions);
      }
export function useCmsPageQueryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<CmsPageQueryQuery, CmsPageQueryQueryVariables>) {
          return Apollo.useLazyQuery<CmsPageQueryQuery, CmsPageQueryQueryVariables>(CmsPageQueryDocument, baseOptions);
        }
export type CmsPageQueryQueryHookResult = ReturnType<typeof useCmsPageQueryQuery>;
export type CmsPageQueryLazyQueryHookResult = ReturnType<typeof useCmsPageQueryLazyQuery>;
export type CmsPageQueryQueryResult = Apollo.QueryResult<CmsPageQueryQuery, CmsPageQueryQueryVariables>;
export const PageAdminDropdownQueryDocument = gql`
    query PageAdminDropdownQuery($id: Int!) {
  cmsParent {
    ... on Convention {
      id
      default_layout {
        id
        name
      }
    }
    ... on RootSite {
      id
      root_site_default_layout: default_layout {
        id
        name
      }
    }
  }
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
}
    `;

/**
 * __usePageAdminDropdownQueryQuery__
 *
 * To run a query within a React component, call `usePageAdminDropdownQueryQuery` and pass it any options that fit your needs.
 * When your component renders, `usePageAdminDropdownQueryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = usePageAdminDropdownQueryQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function usePageAdminDropdownQueryQuery(baseOptions?: Apollo.QueryHookOptions<PageAdminDropdownQueryQuery, PageAdminDropdownQueryQueryVariables>) {
        return Apollo.useQuery<PageAdminDropdownQueryQuery, PageAdminDropdownQueryQueryVariables>(PageAdminDropdownQueryDocument, baseOptions);
      }
export function usePageAdminDropdownQueryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<PageAdminDropdownQueryQuery, PageAdminDropdownQueryQueryVariables>) {
          return Apollo.useLazyQuery<PageAdminDropdownQueryQuery, PageAdminDropdownQueryQueryVariables>(PageAdminDropdownQueryDocument, baseOptions);
        }
export type PageAdminDropdownQueryQueryHookResult = ReturnType<typeof usePageAdminDropdownQueryQuery>;
export type PageAdminDropdownQueryLazyQueryHookResult = ReturnType<typeof usePageAdminDropdownQueryLazyQuery>;
export type PageAdminDropdownQueryQueryResult = Apollo.QueryResult<PageAdminDropdownQueryQuery, PageAdminDropdownQueryQueryVariables>;