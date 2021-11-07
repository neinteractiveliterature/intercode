/* eslint-disable */
import * as Types from '../../graphqlTypes.generated';

import { gql } from '@apollo/client';
import { CmsVariableFieldsFragmentDoc } from './queries.generated';
import * as Apollo from '@apollo/client';
const defaultOptions =  {}
export type SetCmsVariableMutationVariables = Types.Exact<{
  key: Types.Scalars['String'];
  value_json: Types.Scalars['String'];
}>;


export type SetCmsVariableMutationData = { __typename: 'Mutation', setCmsVariable: { __typename: 'SetCmsVariablePayload', cms_variable: { __typename: 'CmsVariable', id: string, key: string, value_json: string, current_ability_can_update: boolean, current_ability_can_delete: boolean } } };

export type DeleteCmsVariableMutationVariables = Types.Exact<{
  key: Types.Scalars['String'];
}>;


export type DeleteCmsVariableMutationData = { __typename: 'Mutation', deleteCmsVariable: { __typename: 'DeleteCmsVariablePayload', cms_variable: { __typename: 'CmsVariable', id: string, key: string, value_json: string, current_ability_can_update: boolean, current_ability_can_delete: boolean } } };


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
export type SetCmsVariableMutationMutationFn = Apollo.MutationFunction<SetCmsVariableMutationData, SetCmsVariableMutationVariables>;

/**
 * __useSetCmsVariableMutation__
 *
 * To run a mutation, you first call `useSetCmsVariableMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSetCmsVariableMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [setCmsVariableMutation, { data, loading, error }] = useSetCmsVariableMutation({
 *   variables: {
 *      key: // value for 'key'
 *      value_json: // value for 'value_json'
 *   },
 * });
 */
export function useSetCmsVariableMutation(baseOptions?: Apollo.MutationHookOptions<SetCmsVariableMutationData, SetCmsVariableMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SetCmsVariableMutationData, SetCmsVariableMutationVariables>(SetCmsVariableMutationDocument, options);
      }
export type SetCmsVariableMutationHookResult = ReturnType<typeof useSetCmsVariableMutation>;
export type SetCmsVariableMutationMutationResult = Apollo.MutationResult<SetCmsVariableMutationData>;
export type SetCmsVariableMutationMutationOptions = Apollo.BaseMutationOptions<SetCmsVariableMutationData, SetCmsVariableMutationVariables>;
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
export type DeleteCmsVariableMutationMutationFn = Apollo.MutationFunction<DeleteCmsVariableMutationData, DeleteCmsVariableMutationVariables>;

/**
 * __useDeleteCmsVariableMutation__
 *
 * To run a mutation, you first call `useDeleteCmsVariableMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteCmsVariableMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteCmsVariableMutation, { data, loading, error }] = useDeleteCmsVariableMutation({
 *   variables: {
 *      key: // value for 'key'
 *   },
 * });
 */
export function useDeleteCmsVariableMutation(baseOptions?: Apollo.MutationHookOptions<DeleteCmsVariableMutationData, DeleteCmsVariableMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteCmsVariableMutationData, DeleteCmsVariableMutationVariables>(DeleteCmsVariableMutationDocument, options);
      }
export type DeleteCmsVariableMutationHookResult = ReturnType<typeof useDeleteCmsVariableMutation>;
export type DeleteCmsVariableMutationMutationResult = Apollo.MutationResult<DeleteCmsVariableMutationData>;
export type DeleteCmsVariableMutationMutationOptions = Apollo.BaseMutationOptions<DeleteCmsVariableMutationData, DeleteCmsVariableMutationVariables>;