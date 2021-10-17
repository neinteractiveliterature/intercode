/* eslint-disable */
import * as Types from '../../graphqlTypes.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions =  {}
export type CmsPageAdminLayoutFieldsFragment = { __typename: 'CmsLayout', name?: string | null | undefined, id: string };

export type CmsPageFieldsFragment = { __typename: 'Page', name?: string | null | undefined, slug?: string | null | undefined, content?: string | null | undefined, admin_notes?: string | null | undefined, skip_clickwrap_agreement?: boolean | null | undefined, hidden_from_search: boolean, current_ability_can_update: boolean, current_ability_can_delete: boolean, id: string, cms_layout?: { __typename: 'CmsLayout', name?: string | null | undefined, id: string } | null | undefined };

export type CmsPagesAdminQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type CmsPagesAdminQueryData = { __typename: 'Query', convention?: { __typename: 'Convention', name: string, id: string } | null | undefined, currentAbility: { __typename: 'Ability', can_create_pages: boolean }, cmsParent: { __typename: 'Convention', id: string, defaultLayout: { __typename: 'CmsLayout', name?: string | null | undefined, id: string }, cmsPages: Array<{ __typename: 'Page', name?: string | null | undefined, slug?: string | null | undefined, content?: string | null | undefined, admin_notes?: string | null | undefined, skip_clickwrap_agreement?: boolean | null | undefined, hidden_from_search: boolean, current_ability_can_update: boolean, current_ability_can_delete: boolean, id: string, cms_layout?: { __typename: 'CmsLayout', name?: string | null | undefined, id: string } | null | undefined }>, cmsLayouts: Array<{ __typename: 'CmsLayout', name?: string | null | undefined, id: string }> } | { __typename: 'RootSite', id: string, root_site_default_layout: { __typename: 'CmsLayout', name?: string | null | undefined, id: string }, cmsPages: Array<{ __typename: 'Page', name?: string | null | undefined, slug?: string | null | undefined, content?: string | null | undefined, admin_notes?: string | null | undefined, skip_clickwrap_agreement?: boolean | null | undefined, hidden_from_search: boolean, current_ability_can_update: boolean, current_ability_can_delete: boolean, id: string, cms_layout?: { __typename: 'CmsLayout', name?: string | null | undefined, id: string } | null | undefined }>, cmsLayouts: Array<{ __typename: 'CmsLayout', name?: string | null | undefined, id: string }> } };

export const CmsPageAdminLayoutFieldsFragmentDoc = gql`
    fragment CmsPageAdminLayoutFields on CmsLayout {
  id: transitionalId
  name
}
    `;
export const CmsPageFieldsFragmentDoc = gql`
    fragment CmsPageFields on Page {
  id: transitionalId
  name
  slug
  content
  admin_notes
  skip_clickwrap_agreement
  hidden_from_search
  current_ability_can_update
  current_ability_can_delete
  cms_layout {
    id: transitionalId
    ...CmsPageAdminLayoutFields
  }
}
    ${CmsPageAdminLayoutFieldsFragmentDoc}`;
export const CmsPagesAdminQueryDocument = gql`
    query CmsPagesAdminQuery {
  convention: conventionByRequestHostIfPresent {
    id: transitionalId
    name
  }
  currentAbility {
    can_create_pages
  }
  cmsParent: cmsParentByRequestHost {
    id: transitionalId
    cmsPages {
      id: transitionalId
      ...CmsPageFields
    }
    cmsLayouts {
      id: transitionalId
      ...CmsPageAdminLayoutFields
    }
    ... on RootSite {
      root_site_default_layout: defaultLayout {
        id: transitionalId
        ...CmsPageAdminLayoutFields
      }
    }
    ... on Convention {
      defaultLayout {
        id: transitionalId
        ...CmsPageAdminLayoutFields
      }
    }
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