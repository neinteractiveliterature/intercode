/* eslint-disable */
import * as Types from '../graphqlTypes.generated';

import { EmailRouteFieldsFragment } from './queries.generated';
import { gql } from '@apollo/client';
import { EmailRouteFieldsFragmentDoc } from './queries.generated';
import * as Apollo from '@apollo/client';
const defaultOptions =  {}
export type CreateEmailRouteMutationVariables = Types.Exact<{
  emailRoute: Types.EmailRouteInput;
}>;


export type CreateEmailRouteMutationData = (
  { __typename: 'Mutation' }
  & { createEmailRoute?: Types.Maybe<(
    { __typename: 'CreateEmailRoutePayload' }
    & { email_route: (
      { __typename: 'EmailRoute' }
      & Pick<Types.EmailRoute, 'id'>
      & EmailRouteFieldsFragment
    ) }
  )> }
);

export type UpdateEmailRouteMutationVariables = Types.Exact<{
  id: Types.Scalars['Int'];
  emailRoute: Types.EmailRouteInput;
}>;


export type UpdateEmailRouteMutationData = (
  { __typename: 'Mutation' }
  & { updateEmailRoute?: Types.Maybe<(
    { __typename: 'UpdateEmailRoutePayload' }
    & { email_route: (
      { __typename: 'EmailRoute' }
      & Pick<Types.EmailRoute, 'id'>
      & EmailRouteFieldsFragment
    ) }
  )> }
);

export type DeleteEmailRouteMutationVariables = Types.Exact<{
  id: Types.Scalars['Int'];
}>;


export type DeleteEmailRouteMutationData = (
  { __typename: 'Mutation' }
  & { deleteEmailRoute?: Types.Maybe<(
    { __typename: 'DeleteEmailRoutePayload' }
    & Pick<Types.DeleteEmailRoutePayload, 'clientMutationId'>
  )> }
);


export const CreateEmailRouteDocument = gql`
    mutation CreateEmailRoute($emailRoute: EmailRouteInput!) {
  createEmailRoute(input: {email_route: $emailRoute}) {
    email_route {
      id
      ...EmailRouteFields
    }
  }
}
    ${EmailRouteFieldsFragmentDoc}`;
export type CreateEmailRouteMutationFn = Apollo.MutationFunction<CreateEmailRouteMutationData, CreateEmailRouteMutationVariables>;

/**
 * __useCreateEmailRouteMutation__
 *
 * To run a mutation, you first call `useCreateEmailRouteMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateEmailRouteMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createEmailRouteMutation, { data, loading, error }] = useCreateEmailRouteMutation({
 *   variables: {
 *      emailRoute: // value for 'emailRoute'
 *   },
 * });
 */
export function useCreateEmailRouteMutation(baseOptions?: Apollo.MutationHookOptions<CreateEmailRouteMutationData, CreateEmailRouteMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateEmailRouteMutationData, CreateEmailRouteMutationVariables>(CreateEmailRouteDocument, options);
      }
export type CreateEmailRouteMutationHookResult = ReturnType<typeof useCreateEmailRouteMutation>;
export type CreateEmailRouteMutationResult = Apollo.MutationResult<CreateEmailRouteMutationData>;
export type CreateEmailRouteMutationOptions = Apollo.BaseMutationOptions<CreateEmailRouteMutationData, CreateEmailRouteMutationVariables>;
export const UpdateEmailRouteDocument = gql`
    mutation UpdateEmailRoute($id: Int!, $emailRoute: EmailRouteInput!) {
  updateEmailRoute(input: {id: $id, email_route: $emailRoute}) {
    email_route {
      id
      ...EmailRouteFields
    }
  }
}
    ${EmailRouteFieldsFragmentDoc}`;
export type UpdateEmailRouteMutationFn = Apollo.MutationFunction<UpdateEmailRouteMutationData, UpdateEmailRouteMutationVariables>;

/**
 * __useUpdateEmailRouteMutation__
 *
 * To run a mutation, you first call `useUpdateEmailRouteMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateEmailRouteMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateEmailRouteMutation, { data, loading, error }] = useUpdateEmailRouteMutation({
 *   variables: {
 *      id: // value for 'id'
 *      emailRoute: // value for 'emailRoute'
 *   },
 * });
 */
export function useUpdateEmailRouteMutation(baseOptions?: Apollo.MutationHookOptions<UpdateEmailRouteMutationData, UpdateEmailRouteMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateEmailRouteMutationData, UpdateEmailRouteMutationVariables>(UpdateEmailRouteDocument, options);
      }
export type UpdateEmailRouteMutationHookResult = ReturnType<typeof useUpdateEmailRouteMutation>;
export type UpdateEmailRouteMutationResult = Apollo.MutationResult<UpdateEmailRouteMutationData>;
export type UpdateEmailRouteMutationOptions = Apollo.BaseMutationOptions<UpdateEmailRouteMutationData, UpdateEmailRouteMutationVariables>;
export const DeleteEmailRouteDocument = gql`
    mutation DeleteEmailRoute($id: Int!) {
  deleteEmailRoute(input: {id: $id}) {
    clientMutationId
  }
}
    `;
export type DeleteEmailRouteMutationFn = Apollo.MutationFunction<DeleteEmailRouteMutationData, DeleteEmailRouteMutationVariables>;

/**
 * __useDeleteEmailRouteMutation__
 *
 * To run a mutation, you first call `useDeleteEmailRouteMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteEmailRouteMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteEmailRouteMutation, { data, loading, error }] = useDeleteEmailRouteMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteEmailRouteMutation(baseOptions?: Apollo.MutationHookOptions<DeleteEmailRouteMutationData, DeleteEmailRouteMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteEmailRouteMutationData, DeleteEmailRouteMutationVariables>(DeleteEmailRouteDocument, options);
      }
export type DeleteEmailRouteMutationHookResult = ReturnType<typeof useDeleteEmailRouteMutation>;
export type DeleteEmailRouteMutationResult = Apollo.MutationResult<DeleteEmailRouteMutationData>;
export type DeleteEmailRouteMutationOptions = Apollo.BaseMutationOptions<DeleteEmailRouteMutationData, DeleteEmailRouteMutationVariables>;