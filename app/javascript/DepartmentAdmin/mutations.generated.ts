/* eslint-disable */
import * as Types from '../graphqlTypes.generated';

import { gql } from '@apollo/client';
import { AdminDepartmentFieldsFragmentDoc } from './queries.generated';
import * as Apollo from '@apollo/client';
const defaultOptions =  {}
export type CreateDepartmentMutationVariables = Types.Exact<{
  department: Types.DepartmentInput;
}>;


export type CreateDepartmentMutationData = { __typename: 'Mutation', createDepartment: { __typename: 'CreateDepartmentPayload', department: { __typename: 'Department', id: number, name: string, proposal_description?: string | null | undefined, event_categories: Array<{ __typename: 'EventCategory', id: number, name: string }> } } };

export type UpdateDepartmentMutationVariables = Types.Exact<{
  id: Types.Scalars['Int'];
  department: Types.DepartmentInput;
}>;


export type UpdateDepartmentMutationData = { __typename: 'Mutation', updateDepartment: { __typename: 'UpdateDepartmentPayload', department: { __typename: 'Department', id: number, name: string, proposal_description?: string | null | undefined, event_categories: Array<{ __typename: 'EventCategory', id: number, name: string }> } } };

export type DeleteDepartmentMutationVariables = Types.Exact<{
  id: Types.Scalars['Int'];
}>;


export type DeleteDepartmentMutationData = { __typename: 'Mutation', deleteDepartment: { __typename: 'DeleteDepartmentPayload', clientMutationId?: string | null | undefined } };


export const CreateDepartmentDocument = gql`
    mutation CreateDepartment($department: DepartmentInput!) {
  createDepartment(input: {department: $department}) {
    department {
      id
      ...AdminDepartmentFields
    }
  }
}
    ${AdminDepartmentFieldsFragmentDoc}`;
export type CreateDepartmentMutationFn = Apollo.MutationFunction<CreateDepartmentMutationData, CreateDepartmentMutationVariables>;

/**
 * __useCreateDepartmentMutation__
 *
 * To run a mutation, you first call `useCreateDepartmentMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateDepartmentMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createDepartmentMutation, { data, loading, error }] = useCreateDepartmentMutation({
 *   variables: {
 *      department: // value for 'department'
 *   },
 * });
 */
export function useCreateDepartmentMutation(baseOptions?: Apollo.MutationHookOptions<CreateDepartmentMutationData, CreateDepartmentMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateDepartmentMutationData, CreateDepartmentMutationVariables>(CreateDepartmentDocument, options);
      }
export type CreateDepartmentMutationHookResult = ReturnType<typeof useCreateDepartmentMutation>;
export type CreateDepartmentMutationResult = Apollo.MutationResult<CreateDepartmentMutationData>;
export type CreateDepartmentMutationOptions = Apollo.BaseMutationOptions<CreateDepartmentMutationData, CreateDepartmentMutationVariables>;
export const UpdateDepartmentDocument = gql`
    mutation UpdateDepartment($id: Int!, $department: DepartmentInput!) {
  updateDepartment(input: {id: $id, department: $department}) {
    department {
      id
      ...AdminDepartmentFields
    }
  }
}
    ${AdminDepartmentFieldsFragmentDoc}`;
export type UpdateDepartmentMutationFn = Apollo.MutationFunction<UpdateDepartmentMutationData, UpdateDepartmentMutationVariables>;

/**
 * __useUpdateDepartmentMutation__
 *
 * To run a mutation, you first call `useUpdateDepartmentMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateDepartmentMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateDepartmentMutation, { data, loading, error }] = useUpdateDepartmentMutation({
 *   variables: {
 *      id: // value for 'id'
 *      department: // value for 'department'
 *   },
 * });
 */
export function useUpdateDepartmentMutation(baseOptions?: Apollo.MutationHookOptions<UpdateDepartmentMutationData, UpdateDepartmentMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateDepartmentMutationData, UpdateDepartmentMutationVariables>(UpdateDepartmentDocument, options);
      }
export type UpdateDepartmentMutationHookResult = ReturnType<typeof useUpdateDepartmentMutation>;
export type UpdateDepartmentMutationResult = Apollo.MutationResult<UpdateDepartmentMutationData>;
export type UpdateDepartmentMutationOptions = Apollo.BaseMutationOptions<UpdateDepartmentMutationData, UpdateDepartmentMutationVariables>;
export const DeleteDepartmentDocument = gql`
    mutation DeleteDepartment($id: Int!) {
  deleteDepartment(input: {id: $id}) {
    clientMutationId
  }
}
    `;
export type DeleteDepartmentMutationFn = Apollo.MutationFunction<DeleteDepartmentMutationData, DeleteDepartmentMutationVariables>;

/**
 * __useDeleteDepartmentMutation__
 *
 * To run a mutation, you first call `useDeleteDepartmentMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteDepartmentMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteDepartmentMutation, { data, loading, error }] = useDeleteDepartmentMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteDepartmentMutation(baseOptions?: Apollo.MutationHookOptions<DeleteDepartmentMutationData, DeleteDepartmentMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteDepartmentMutationData, DeleteDepartmentMutationVariables>(DeleteDepartmentDocument, options);
      }
export type DeleteDepartmentMutationHookResult = ReturnType<typeof useDeleteDepartmentMutation>;
export type DeleteDepartmentMutationResult = Apollo.MutationResult<DeleteDepartmentMutationData>;
export type DeleteDepartmentMutationOptions = Apollo.BaseMutationOptions<DeleteDepartmentMutationData, DeleteDepartmentMutationVariables>;