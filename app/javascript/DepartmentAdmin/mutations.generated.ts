/* eslint-disable */
import * as Types from '../graphqlTypes.generated';

import { AdminDepartmentFieldsFragment } from './queries.generated';
import { gql } from '@apollo/client';
import { AdminDepartmentFieldsFragmentDoc } from './queries.generated';
import * as Apollo from '@apollo/client';
export type CreateDepartmentMutationVariables = Types.Exact<{
  department: Types.DepartmentInput;
}>;


export type CreateDepartmentMutation = (
  { __typename?: 'Mutation' }
  & { createDepartment?: Types.Maybe<(
    { __typename?: 'CreateDepartmentPayload' }
    & { department: (
      { __typename?: 'Department' }
      & Pick<Types.Department, 'id'>
      & AdminDepartmentFieldsFragment
    ) }
  )> }
);

export type UpdateDepartmentMutationVariables = Types.Exact<{
  id: Types.Scalars['Int'];
  department: Types.DepartmentInput;
}>;


export type UpdateDepartmentMutation = (
  { __typename?: 'Mutation' }
  & { updateDepartment?: Types.Maybe<(
    { __typename?: 'UpdateDepartmentPayload' }
    & { department: (
      { __typename?: 'Department' }
      & Pick<Types.Department, 'id'>
      & AdminDepartmentFieldsFragment
    ) }
  )> }
);

export type DeleteDepartmentMutationVariables = Types.Exact<{
  id: Types.Scalars['Int'];
}>;


export type DeleteDepartmentMutation = (
  { __typename?: 'Mutation' }
  & { deleteDepartment?: Types.Maybe<(
    { __typename?: 'DeleteDepartmentPayload' }
    & Pick<Types.DeleteDepartmentPayload, 'clientMutationId'>
  )> }
);


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
export type CreateDepartmentMutationFn = Apollo.MutationFunction<CreateDepartmentMutation, CreateDepartmentMutationVariables>;

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
export function useCreateDepartmentMutation(baseOptions?: Apollo.MutationHookOptions<CreateDepartmentMutation, CreateDepartmentMutationVariables>) {
        return Apollo.useMutation<CreateDepartmentMutation, CreateDepartmentMutationVariables>(CreateDepartmentDocument, baseOptions);
      }
export type CreateDepartmentMutationHookResult = ReturnType<typeof useCreateDepartmentMutation>;
export type CreateDepartmentMutationResult = Apollo.MutationResult<CreateDepartmentMutation>;
export type CreateDepartmentMutationOptions = Apollo.BaseMutationOptions<CreateDepartmentMutation, CreateDepartmentMutationVariables>;
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
export type UpdateDepartmentMutationFn = Apollo.MutationFunction<UpdateDepartmentMutation, UpdateDepartmentMutationVariables>;

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
export function useUpdateDepartmentMutation(baseOptions?: Apollo.MutationHookOptions<UpdateDepartmentMutation, UpdateDepartmentMutationVariables>) {
        return Apollo.useMutation<UpdateDepartmentMutation, UpdateDepartmentMutationVariables>(UpdateDepartmentDocument, baseOptions);
      }
export type UpdateDepartmentMutationHookResult = ReturnType<typeof useUpdateDepartmentMutation>;
export type UpdateDepartmentMutationResult = Apollo.MutationResult<UpdateDepartmentMutation>;
export type UpdateDepartmentMutationOptions = Apollo.BaseMutationOptions<UpdateDepartmentMutation, UpdateDepartmentMutationVariables>;
export const DeleteDepartmentDocument = gql`
    mutation DeleteDepartment($id: Int!) {
  deleteDepartment(input: {id: $id}) {
    clientMutationId
  }
}
    `;
export type DeleteDepartmentMutationFn = Apollo.MutationFunction<DeleteDepartmentMutation, DeleteDepartmentMutationVariables>;

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
export function useDeleteDepartmentMutation(baseOptions?: Apollo.MutationHookOptions<DeleteDepartmentMutation, DeleteDepartmentMutationVariables>) {
        return Apollo.useMutation<DeleteDepartmentMutation, DeleteDepartmentMutationVariables>(DeleteDepartmentDocument, baseOptions);
      }
export type DeleteDepartmentMutationHookResult = ReturnType<typeof useDeleteDepartmentMutation>;
export type DeleteDepartmentMutationResult = Apollo.MutationResult<DeleteDepartmentMutation>;
export type DeleteDepartmentMutationOptions = Apollo.BaseMutationOptions<DeleteDepartmentMutation, DeleteDepartmentMutationVariables>;