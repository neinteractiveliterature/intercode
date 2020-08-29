/* eslint-disable */
import * as Types from '../../graphqlTypes.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type CmsVariableFieldsFragment = (
  { __typename?: 'CmsVariable' }
  & Pick<Types.CmsVariable, 'id' | 'key' | 'value_json' | 'current_ability_can_update' | 'current_ability_can_delete'>
);

export type CmsVariablesQueryQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type CmsVariablesQueryQuery = (
  { __typename?: 'Query' }
  & { cmsVariables: Array<(
    { __typename?: 'CmsVariable' }
    & Pick<Types.CmsVariable, 'id'>
    & CmsVariableFieldsFragment
  )>, currentAbility: (
    { __typename?: 'Ability' }
    & Pick<Types.Ability, 'can_create_cms_variables'>
  ) }
);

export type SetCmsVariableMutationMutationVariables = Types.Exact<{
  key: Types.Scalars['String'];
  value_json: Types.Scalars['String'];
}>;


export type SetCmsVariableMutationMutation = (
  { __typename?: 'Mutation' }
  & { setCmsVariable?: Types.Maybe<(
    { __typename?: 'SetCmsVariablePayload' }
    & { cms_variable: (
      { __typename?: 'CmsVariable' }
      & Pick<Types.CmsVariable, 'id'>
      & CmsVariableFieldsFragment
    ) }
  )> }
);

export type DeleteCmsVariableMutationMutationVariables = Types.Exact<{
  key: Types.Scalars['String'];
}>;


export type DeleteCmsVariableMutationMutation = (
  { __typename?: 'Mutation' }
  & { deleteCmsVariable?: Types.Maybe<(
    { __typename?: 'DeleteCmsVariablePayload' }
    & { cms_variable: (
      { __typename?: 'CmsVariable' }
      & Pick<Types.CmsVariable, 'id'>
      & CmsVariableFieldsFragment
    ) }
  )> }
);

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
  cmsVariables {
    id
    ...CmsVariableFields
  }
  currentAbility {
    can_create_cms_variables
  }
}
    ${CmsVariableFieldsFragmentDoc}`;

/**
 * __useCmsVariablesQueryQuery__
 *
 * To run a query within a React component, call `useCmsVariablesQueryQuery` and pass it any options that fit your needs.
 * When your component renders, `useCmsVariablesQueryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCmsVariablesQueryQuery({
 *   variables: {
 *   },
 * });
 */
export function useCmsVariablesQueryQuery(baseOptions?: Apollo.QueryHookOptions<CmsVariablesQueryQuery, CmsVariablesQueryQueryVariables>) {
        return Apollo.useQuery<CmsVariablesQueryQuery, CmsVariablesQueryQueryVariables>(CmsVariablesQueryDocument, baseOptions);
      }
export function useCmsVariablesQueryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<CmsVariablesQueryQuery, CmsVariablesQueryQueryVariables>) {
          return Apollo.useLazyQuery<CmsVariablesQueryQuery, CmsVariablesQueryQueryVariables>(CmsVariablesQueryDocument, baseOptions);
        }
export type CmsVariablesQueryQueryHookResult = ReturnType<typeof useCmsVariablesQueryQuery>;
export type CmsVariablesQueryLazyQueryHookResult = ReturnType<typeof useCmsVariablesQueryLazyQuery>;
export type CmsVariablesQueryQueryResult = Apollo.QueryResult<CmsVariablesQueryQuery, CmsVariablesQueryQueryVariables>;
export const SetCmsVariableMutationDocument = gql`
    mutation SetCmsVariableMutation($key: String!, $value_json: String!) {
  setCmsVariable(input: {cms_variable: {key: $key, value_json: $value_json}}) {
    cms_variable {
      id
      ...CmsVariableFields
    }
  }
}
    ${CmsVariableFieldsFragmentDoc}`;
export type SetCmsVariableMutationMutationFn = Apollo.MutationFunction<SetCmsVariableMutationMutation, SetCmsVariableMutationMutationVariables>;

/**
 * __useSetCmsVariableMutationMutation__
 *
 * To run a mutation, you first call `useSetCmsVariableMutationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSetCmsVariableMutationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [setCmsVariableMutationMutation, { data, loading, error }] = useSetCmsVariableMutationMutation({
 *   variables: {
 *      key: // value for 'key'
 *      value_json: // value for 'value_json'
 *   },
 * });
 */
export function useSetCmsVariableMutationMutation(baseOptions?: Apollo.MutationHookOptions<SetCmsVariableMutationMutation, SetCmsVariableMutationMutationVariables>) {
        return Apollo.useMutation<SetCmsVariableMutationMutation, SetCmsVariableMutationMutationVariables>(SetCmsVariableMutationDocument, baseOptions);
      }
export type SetCmsVariableMutationMutationHookResult = ReturnType<typeof useSetCmsVariableMutationMutation>;
export type SetCmsVariableMutationMutationResult = Apollo.MutationResult<SetCmsVariableMutationMutation>;
export type SetCmsVariableMutationMutationOptions = Apollo.BaseMutationOptions<SetCmsVariableMutationMutation, SetCmsVariableMutationMutationVariables>;
export const DeleteCmsVariableMutationDocument = gql`
    mutation DeleteCmsVariableMutation($key: String!) {
  deleteCmsVariable(input: {key: $key}) {
    cms_variable {
      id
      ...CmsVariableFields
    }
  }
}
    ${CmsVariableFieldsFragmentDoc}`;
export type DeleteCmsVariableMutationMutationFn = Apollo.MutationFunction<DeleteCmsVariableMutationMutation, DeleteCmsVariableMutationMutationVariables>;

/**
 * __useDeleteCmsVariableMutationMutation__
 *
 * To run a mutation, you first call `useDeleteCmsVariableMutationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteCmsVariableMutationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteCmsVariableMutationMutation, { data, loading, error }] = useDeleteCmsVariableMutationMutation({
 *   variables: {
 *      key: // value for 'key'
 *   },
 * });
 */
export function useDeleteCmsVariableMutationMutation(baseOptions?: Apollo.MutationHookOptions<DeleteCmsVariableMutationMutation, DeleteCmsVariableMutationMutationVariables>) {
        return Apollo.useMutation<DeleteCmsVariableMutationMutation, DeleteCmsVariableMutationMutationVariables>(DeleteCmsVariableMutationDocument, baseOptions);
      }
export type DeleteCmsVariableMutationMutationHookResult = ReturnType<typeof useDeleteCmsVariableMutationMutation>;
export type DeleteCmsVariableMutationMutationResult = Apollo.MutationResult<DeleteCmsVariableMutationMutation>;
export type DeleteCmsVariableMutationMutationOptions = Apollo.BaseMutationOptions<DeleteCmsVariableMutationMutation, DeleteCmsVariableMutationMutationVariables>;