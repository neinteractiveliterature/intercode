/* eslint-disable */
import * as Types from '../../graphqlTypes.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type CmsVariableFieldsFragment = { __typename: 'CmsVariable', id: string, key: string, value_json: string, current_ability_can_update: boolean, current_ability_can_delete: boolean };

export type CmsVariablesQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type CmsVariablesQueryData = { __typename: 'Query', cmsParent: { __typename: 'Convention', id: string, cmsVariables: Array<{ __typename: 'CmsVariable', id: string, key: string, value_json: string, current_ability_can_update: boolean, current_ability_can_delete: boolean }> } | { __typename: 'RootSite', id: string, cmsVariables: Array<{ __typename: 'CmsVariable', id: string, key: string, value_json: string, current_ability_can_update: boolean, current_ability_can_delete: boolean }> }, currentAbility: { __typename: 'Ability', can_create_cms_variables: boolean } };

export const CmsVariableFieldsFragmentDoc = gql`
    fragment CmsVariableFields on CmsVariable {
  id
  key
  value_json
  current_ability_can_update
  current_ability_can_delete
}
    `;
export const CmsVariablesQueryDocument = gql`
    query CmsVariablesQuery {
  cmsParent: cmsParentByRequestHost {
    id
    cmsVariables {
      id
      ...CmsVariableFields
    }
  }
  currentAbility {
    can_create_cms_variables
  }
}
    ${CmsVariableFieldsFragmentDoc}`;

/**
 * __useCmsVariablesQuery__
 *
 * To run a query within a React component, call `useCmsVariablesQuery` and pass it any options that fit your needs.
 * When your component renders, `useCmsVariablesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCmsVariablesQuery({
 *   variables: {
 *   },
 * });
 */
export function useCmsVariablesQuery(baseOptions?: Apollo.QueryHookOptions<CmsVariablesQueryData, CmsVariablesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<CmsVariablesQueryData, CmsVariablesQueryVariables>(CmsVariablesQueryDocument, options);
      }
export function useCmsVariablesQueryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<CmsVariablesQueryData, CmsVariablesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<CmsVariablesQueryData, CmsVariablesQueryVariables>(CmsVariablesQueryDocument, options);
        }
export type CmsVariablesQueryHookResult = ReturnType<typeof useCmsVariablesQuery>;
export type CmsVariablesQueryLazyQueryHookResult = ReturnType<typeof useCmsVariablesQueryLazyQuery>;
export type CmsVariablesQueryQueryResult = Apollo.QueryResult<CmsVariablesQueryData, CmsVariablesQueryVariables>;