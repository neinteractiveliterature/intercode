/* eslint-disable */
import * as Types from '../../graphqlTypes.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions =  {}
export type CmsPartialFieldsFragment = { __typename: 'CmsPartial', id: number, name?: string | null | undefined, content?: string | null | undefined, admin_notes?: string | null | undefined, current_ability_can_update: boolean, current_ability_can_delete: boolean };

export type CmsPartialsAdminQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type CmsPartialsAdminQueryData = { __typename: 'Query', convention?: { __typename: 'Convention', id: number, name: string } | null | undefined, currentAbility: { __typename: 'Ability', can_create_cms_partials: boolean }, cmsParent: { __typename: 'Convention', id: number, cmsPartials: Array<{ __typename: 'CmsPartial', id: number, name?: string | null | undefined, content?: string | null | undefined, admin_notes?: string | null | undefined, current_ability_can_update: boolean, current_ability_can_delete: boolean }> } | { __typename: 'RootSite', id: number, cmsPartials: Array<{ __typename: 'CmsPartial', id: number, name?: string | null | undefined, content?: string | null | undefined, admin_notes?: string | null | undefined, current_ability_can_update: boolean, current_ability_can_delete: boolean }> } };

export const CmsPartialFieldsFragmentDoc = gql`
    fragment CmsPartialFields on CmsPartial {
  id
  name
  content
  admin_notes
  current_ability_can_update
  current_ability_can_delete
}
    `;
export const CmsPartialsAdminQueryDocument = gql`
    query CmsPartialsAdminQuery {
  convention: conventionByRequestHostIfPresent {
    id
    name
  }
  currentAbility {
    can_create_cms_partials
  }
  cmsParent: cmsParentByRequestHost {
    id
    cmsPartials {
      id
      ...CmsPartialFields
    }
  }
}
    ${CmsPartialFieldsFragmentDoc}`;

/**
 * __useCmsPartialsAdminQuery__
 *
 * To run a query within a React component, call `useCmsPartialsAdminQuery` and pass it any options that fit your needs.
 * When your component renders, `useCmsPartialsAdminQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCmsPartialsAdminQuery({
 *   variables: {
 *   },
 * });
 */
export function useCmsPartialsAdminQuery(baseOptions?: Apollo.QueryHookOptions<CmsPartialsAdminQueryData, CmsPartialsAdminQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<CmsPartialsAdminQueryData, CmsPartialsAdminQueryVariables>(CmsPartialsAdminQueryDocument, options);
      }
export function useCmsPartialsAdminQueryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<CmsPartialsAdminQueryData, CmsPartialsAdminQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<CmsPartialsAdminQueryData, CmsPartialsAdminQueryVariables>(CmsPartialsAdminQueryDocument, options);
        }
export type CmsPartialsAdminQueryHookResult = ReturnType<typeof useCmsPartialsAdminQuery>;
export type CmsPartialsAdminQueryLazyQueryHookResult = ReturnType<typeof useCmsPartialsAdminQueryLazyQuery>;
export type CmsPartialsAdminQueryQueryResult = Apollo.QueryResult<CmsPartialsAdminQueryData, CmsPartialsAdminQueryVariables>;