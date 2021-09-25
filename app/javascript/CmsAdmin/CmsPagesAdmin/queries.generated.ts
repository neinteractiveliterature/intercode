/* eslint-disable */
import * as Types from '../../graphqlTypes.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions =  {}
export type CmsPageAdminLayoutFieldsFragment = { __typename: 'CmsLayout', id: number, name?: Types.Maybe<string> };

export type CmsPageFieldsFragment = { __typename: 'Page', id: number, name?: Types.Maybe<string>, slug?: Types.Maybe<string>, content?: Types.Maybe<string>, admin_notes?: Types.Maybe<string>, skip_clickwrap_agreement?: Types.Maybe<boolean>, hidden_from_search: boolean, current_ability_can_update: boolean, current_ability_can_delete: boolean, cms_layout?: Types.Maybe<{ __typename: 'CmsLayout', id: number, name?: Types.Maybe<string> }> };

export type CmsPagesAdminQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type CmsPagesAdminQueryData = { __typename: 'Query', convention?: Types.Maybe<{ __typename: 'Convention', id: number, name: string }>, currentAbility: { __typename: 'Ability', can_create_pages: boolean }, cmsPages: Array<{ __typename: 'Page', id: number, name?: Types.Maybe<string>, slug?: Types.Maybe<string>, content?: Types.Maybe<string>, admin_notes?: Types.Maybe<string>, skip_clickwrap_agreement?: Types.Maybe<boolean>, hidden_from_search: boolean, current_ability_can_update: boolean, current_ability_can_delete: boolean, cms_layout?: Types.Maybe<{ __typename: 'CmsLayout', id: number, name?: Types.Maybe<string> }> }>, cmsParent: { __typename: 'Convention', id: number, default_layout: { __typename: 'CmsLayout', id: number, name?: Types.Maybe<string> } } | { __typename: 'RootSite', id: number, root_site_default_layout: { __typename: 'CmsLayout', id: number, name?: Types.Maybe<string> } }, cmsLayouts: Array<{ __typename: 'CmsLayout', id: number, name?: Types.Maybe<string> }> };

export const CmsPageAdminLayoutFieldsFragmentDoc = gql`
    fragment CmsPageAdminLayoutFields on CmsLayout {
  id
  name
}
    `;
export const CmsPageFieldsFragmentDoc = gql`
    fragment CmsPageFields on Page {
  id
  name
  slug
  content
  admin_notes
  skip_clickwrap_agreement
  hidden_from_search
  current_ability_can_update
  current_ability_can_delete
  cms_layout {
    id
    ...CmsPageAdminLayoutFields
  }
}
    ${CmsPageAdminLayoutFieldsFragmentDoc}`;
export const CmsPagesAdminQueryDocument = gql`
    query CmsPagesAdminQuery {
  convention {
    id
    name
  }
  currentAbility {
    can_create_pages
  }
  cmsPages {
    id
    ...CmsPageFields
  }
  cmsParent {
    ... on RootSite {
      id
      root_site_default_layout: default_layout {
        id
        ...CmsPageAdminLayoutFields
      }
    }
    ... on Convention {
      id
      default_layout {
        id
        ...CmsPageAdminLayoutFields
      }
    }
  }
  cmsLayouts {
    id
    ...CmsPageAdminLayoutFields
  }
}
    ${CmsPageFieldsFragmentDoc}
${CmsPageAdminLayoutFieldsFragmentDoc}`;

/**
 * __useCmsPagesAdminQuery__
 *
 * To run a query within a React component, call `useCmsPagesAdminQuery` and pass it any options that fit your needs.
 * When your component renders, `useCmsPagesAdminQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCmsPagesAdminQuery({
 *   variables: {
 *   },
 * });
 */
export function useCmsPagesAdminQuery(baseOptions?: Apollo.QueryHookOptions<CmsPagesAdminQueryData, CmsPagesAdminQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<CmsPagesAdminQueryData, CmsPagesAdminQueryVariables>(CmsPagesAdminQueryDocument, options);
      }
export function useCmsPagesAdminQueryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<CmsPagesAdminQueryData, CmsPagesAdminQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<CmsPagesAdminQueryData, CmsPagesAdminQueryVariables>(CmsPagesAdminQueryDocument, options);
        }
export type CmsPagesAdminQueryHookResult = ReturnType<typeof useCmsPagesAdminQuery>;
export type CmsPagesAdminQueryLazyQueryHookResult = ReturnType<typeof useCmsPagesAdminQueryLazyQuery>;
export type CmsPagesAdminQueryQueryResult = Apollo.QueryResult<CmsPagesAdminQueryData, CmsPagesAdminQueryVariables>;