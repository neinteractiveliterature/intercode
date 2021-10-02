/* eslint-disable */
import * as Types from '../../graphqlTypes.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions =  {}
export type CmsLayoutFieldsFragment = { __typename: 'CmsLayout', id: number, name?: string | null | undefined, content?: string | null | undefined, navbar_classes?: string | null | undefined, admin_notes?: string | null | undefined, current_ability_can_update: boolean, current_ability_can_delete: boolean };

export type CmsLayoutsAdminQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type CmsLayoutsAdminQueryData = { __typename: 'Query', convention?: { __typename: 'Convention', id: number, name: string } | null | undefined, currentAbility: { __typename: 'Ability', can_create_cms_layouts: boolean }, cmsParent: { __typename: 'Convention', id: number, cmsLayouts: Array<{ __typename: 'CmsLayout', id: number, name?: string | null | undefined, content?: string | null | undefined, navbar_classes?: string | null | undefined, admin_notes?: string | null | undefined, current_ability_can_update: boolean, current_ability_can_delete: boolean }> } | { __typename: 'RootSite', id: number, cmsLayouts: Array<{ __typename: 'CmsLayout', id: number, name?: string | null | undefined, content?: string | null | undefined, navbar_classes?: string | null | undefined, admin_notes?: string | null | undefined, current_ability_can_update: boolean, current_ability_can_delete: boolean }> } };

export const CmsLayoutFieldsFragmentDoc = gql`
    fragment CmsLayoutFields on CmsLayout {
  id
  name
  content
  navbar_classes
  admin_notes
  current_ability_can_update
  current_ability_can_delete
}
    `;
export const CmsLayoutsAdminQueryDocument = gql`
    query CmsLayoutsAdminQuery {
  convention: conventionByRequestHostIfPresent {
    id
    name
  }
  currentAbility {
    can_create_cms_layouts
  }
  cmsParent: cmsParentByRequestHost {
    id
    cmsLayouts {
      id
      ...CmsLayoutFields
    }
  }
}
    ${CmsLayoutFieldsFragmentDoc}`;

/**
 * __useCmsLayoutsAdminQuery__
 *
 * To run a query within a React component, call `useCmsLayoutsAdminQuery` and pass it any options that fit your needs.
 * When your component renders, `useCmsLayoutsAdminQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCmsLayoutsAdminQuery({
 *   variables: {
 *   },
 * });
 */
export function useCmsLayoutsAdminQuery(baseOptions?: Apollo.QueryHookOptions<CmsLayoutsAdminQueryData, CmsLayoutsAdminQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<CmsLayoutsAdminQueryData, CmsLayoutsAdminQueryVariables>(CmsLayoutsAdminQueryDocument, options);
      }
export function useCmsLayoutsAdminQueryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<CmsLayoutsAdminQueryData, CmsLayoutsAdminQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<CmsLayoutsAdminQueryData, CmsLayoutsAdminQueryVariables>(CmsLayoutsAdminQueryDocument, options);
        }
export type CmsLayoutsAdminQueryHookResult = ReturnType<typeof useCmsLayoutsAdminQuery>;
export type CmsLayoutsAdminQueryLazyQueryHookResult = ReturnType<typeof useCmsLayoutsAdminQueryLazyQuery>;
export type CmsLayoutsAdminQueryQueryResult = Apollo.QueryResult<CmsLayoutsAdminQueryData, CmsLayoutsAdminQueryVariables>;