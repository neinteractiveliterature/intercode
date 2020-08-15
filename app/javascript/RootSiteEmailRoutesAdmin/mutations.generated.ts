/* eslint-disable */
import * as Types from '../graphqlTypes.generated';

import { EmailRouteFieldsFragment } from './queries.generated';
import { gql } from '@apollo/client';
import { EmailRouteFieldsFragmentDoc } from './queries.generated';
import * as Apollo from '@apollo/client';


export type CreateEmailRouteMutationVariables = Types.Exact<{
  emailRoute: Types.EmailRouteInput;
}>;


export type CreateEmailRouteMutation = (
  { __typename?: 'Mutation' }
  & { createEmailRoute?: Types.Maybe<(
    { __typename?: 'CreateEmailRoutePayload' }
    & { email_route: (
      { __typename?: 'EmailRoute' }
      & Pick<Types.EmailRoute, 'id'>
      & EmailRouteFieldsFragment
    ) }
  )> }
);

export type UpdateEmailRouteMutationVariables = Types.Exact<{
  id: Types.Scalars['Int'];
  emailRoute: Types.EmailRouteInput;
}>;


export type UpdateEmailRouteMutation = (
  { __typename?: 'Mutation' }
  & { updateEmailRoute?: Types.Maybe<(
    { __typename?: 'UpdateEmailRoutePayload' }
    & { email_route: (
      { __typename?: 'EmailRoute' }
      & Pick<Types.EmailRoute, 'id'>
      & EmailRouteFieldsFragment
    ) }
  )> }
);

export type DeleteEmailRouteMutationVariables = Types.Exact<{
  id: Types.Scalars['Int'];
}>;


export type DeleteEmailRouteMutation = (
  { __typename?: 'Mutation' }
  & { deleteEmailRoute?: Types.Maybe<(
    { __typename?: 'DeleteEmailRoutePayload' }
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
export type CreateEmailRouteMutationFn = Apollo.MutationFunction<CreateEmailRouteMutation, CreateEmailRouteMutationVariables>;

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
export function useCreateEmailRouteMutation(baseOptions?: Apollo.MutationHookOptions<CreateEmailRouteMutation, CreateEmailRouteMutationVariables>) {
        return Apollo.useMutation<CreateEmailRouteMutation, CreateEmailRouteMutationVariables>(CreateEmailRouteDocument, baseOptions);
      }
export type CreateEmailRouteMutationHookResult = ReturnType<typeof useCreateEmailRouteMutation>;
export type CreateEmailRouteMutationResult = Apollo.MutationResult<CreateEmailRouteMutation>;
export type CreateEmailRouteMutationOptions = Apollo.BaseMutationOptions<CreateEmailRouteMutation, CreateEmailRouteMutationVariables>;
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
export type UpdateEmailRouteMutationFn = Apollo.MutationFunction<UpdateEmailRouteMutation, UpdateEmailRouteMutationVariables>;

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
export function useUpdateEmailRouteMutation(baseOptions?: Apollo.MutationHookOptions<UpdateEmailRouteMutation, UpdateEmailRouteMutationVariables>) {
        return Apollo.useMutation<UpdateEmailRouteMutation, UpdateEmailRouteMutationVariables>(UpdateEmailRouteDocument, baseOptions);
      }
export type UpdateEmailRouteMutationHookResult = ReturnType<typeof useUpdateEmailRouteMutation>;
export type UpdateEmailRouteMutationResult = Apollo.MutationResult<UpdateEmailRouteMutation>;
export type UpdateEmailRouteMutationOptions = Apollo.BaseMutationOptions<UpdateEmailRouteMutation, UpdateEmailRouteMutationVariables>;
export const DeleteEmailRouteDocument = gql`
    mutation DeleteEmailRoute($id: Int!) {
  deleteEmailRoute(input: {id: $id}) {
    clientMutationId
  }
}
    `;
export type DeleteEmailRouteMutationFn = Apollo.MutationFunction<DeleteEmailRouteMutation, DeleteEmailRouteMutationVariables>;

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
export function useDeleteEmailRouteMutation(baseOptions?: Apollo.MutationHookOptions<DeleteEmailRouteMutation, DeleteEmailRouteMutationVariables>) {
        return Apollo.useMutation<DeleteEmailRouteMutation, DeleteEmailRouteMutationVariables>(DeleteEmailRouteDocument, baseOptions);
      }
export type DeleteEmailRouteMutationHookResult = ReturnType<typeof useDeleteEmailRouteMutation>;
export type DeleteEmailRouteMutationResult = Apollo.MutationResult<DeleteEmailRouteMutation>;
export type DeleteEmailRouteMutationOptions = Apollo.BaseMutationOptions<DeleteEmailRouteMutation, DeleteEmailRouteMutationVariables>;