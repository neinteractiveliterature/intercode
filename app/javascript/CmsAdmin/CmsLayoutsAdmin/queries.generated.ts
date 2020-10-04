/* eslint-disable */
import * as Types from '../../graphqlTypes.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type CmsLayoutFieldsFragment = (
  { __typename: 'CmsLayout' }
  & Pick<Types.CmsLayout, 'id' | 'name' | 'content' | 'navbar_classes' | 'admin_notes' | 'current_ability_can_update' | 'current_ability_can_delete'>
);

export type CmsLayoutsAdminQueryQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type CmsLayoutsAdminQueryQuery = (
  { __typename: 'Query' }
  & { convention?: Types.Maybe<(
    { __typename: 'Convention' }
    & Pick<Types.Convention, 'id' | 'name'>
  )>, currentAbility: (
    { __typename: 'Ability' }
    & Pick<Types.Ability, 'can_create_cms_layouts'>
  ), cmsLayouts: Array<(
    { __typename: 'CmsLayout' }
    & Pick<Types.CmsLayout, 'id'>
    & CmsLayoutFieldsFragment
  )> }
);

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
  convention {
    id
    name
  }
  currentAbility {
    can_create_cms_layouts
  }
  cmsLayouts {
    id
    ...CmsLayoutFields
  }
}
    ${CmsLayoutFieldsFragmentDoc}`;

/**
 * __useCmsLayoutsAdminQueryQuery__
 *
 * To run a query within a React component, call `useCmsLayoutsAdminQueryQuery` and pass it any options that fit your needs.
 * When your component renders, `useCmsLayoutsAdminQueryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCmsLayoutsAdminQueryQuery({
 *   variables: {
 *   },
 * });
 */
export function useCmsLayoutsAdminQueryQuery(baseOptions?: Apollo.QueryHookOptions<CmsLayoutsAdminQueryQuery, CmsLayoutsAdminQueryQueryVariables>) {
        return Apollo.useQuery<CmsLayoutsAdminQueryQuery, CmsLayoutsAdminQueryQueryVariables>(CmsLayoutsAdminQueryDocument, baseOptions);
      }
export function useCmsLayoutsAdminQueryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<CmsLayoutsAdminQueryQuery, CmsLayoutsAdminQueryQueryVariables>) {
          return Apollo.useLazyQuery<CmsLayoutsAdminQueryQuery, CmsLayoutsAdminQueryQueryVariables>(CmsLayoutsAdminQueryDocument, baseOptions);
        }
export type CmsLayoutsAdminQueryQueryHookResult = ReturnType<typeof useCmsLayoutsAdminQueryQuery>;
export type CmsLayoutsAdminQueryLazyQueryHookResult = ReturnType<typeof useCmsLayoutsAdminQueryLazyQuery>;
export type CmsLayoutsAdminQueryQueryResult = Apollo.QueryResult<CmsLayoutsAdminQueryQuery, CmsLayoutsAdminQueryQueryVariables>;