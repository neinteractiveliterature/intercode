/* eslint-disable */
import * as Types from '../../graphqlTypes.generated';

import { AdminCouponFieldsFragment } from './queries.generated';
import { gql } from '@apollo/client';
import { AdminCouponFieldsFragmentDoc } from './queries.generated';
import * as Apollo from '@apollo/client';
export type CreateCouponMutationVariables = Types.Exact<{
  coupon: Types.CouponInput;
}>;


export type CreateCouponMutation = (
  { __typename?: 'Mutation' }
  & { createCoupon?: Types.Maybe<(
    { __typename?: 'CreateCouponPayload' }
    & { coupon: (
      { __typename?: 'Coupon' }
      & Pick<Types.Coupon, 'id'>
      & AdminCouponFieldsFragment
    ) }
  )> }
);

export type UpdateCouponMutationVariables = Types.Exact<{
  id: Types.Scalars['Int'];
  coupon: Types.CouponInput;
}>;


export type UpdateCouponMutation = (
  { __typename?: 'Mutation' }
  & { updateCoupon?: Types.Maybe<(
    { __typename?: 'UpdateCouponPayload' }
    & { coupon: (
      { __typename?: 'Coupon' }
      & Pick<Types.Coupon, 'id'>
      & AdminCouponFieldsFragment
    ) }
  )> }
);

export type DeleteCouponMutationVariables = Types.Exact<{
  id: Types.Scalars['Int'];
}>;


export type DeleteCouponMutation = (
  { __typename?: 'Mutation' }
  & { deleteCoupon?: Types.Maybe<(
    { __typename?: 'DeleteCouponPayload' }
    & Pick<Types.DeleteCouponPayload, 'clientMutationId'>
  )> }
);


export const CreateCouponDocument = gql`
    mutation CreateCoupon($coupon: CouponInput!) {
  createCoupon(input: {coupon: $coupon}) {
    coupon {
      id
      ...AdminCouponFields
    }
  }
}
    ${AdminCouponFieldsFragmentDoc}`;
export type CreateCouponMutationFn = Apollo.MutationFunction<CreateCouponMutation, CreateCouponMutationVariables>;

/**
 * __useCreateCouponMutation__
 *
 * To run a mutation, you first call `useCreateCouponMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateCouponMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createCouponMutation, { data, loading, error }] = useCreateCouponMutation({
 *   variables: {
 *      coupon: // value for 'coupon'
 *   },
 * });
 */
export function useCreateCouponMutation(baseOptions?: Apollo.MutationHookOptions<CreateCouponMutation, CreateCouponMutationVariables>) {
        return Apollo.useMutation<CreateCouponMutation, CreateCouponMutationVariables>(CreateCouponDocument, baseOptions);
      }
export type CreateCouponMutationHookResult = ReturnType<typeof useCreateCouponMutation>;
export type CreateCouponMutationResult = Apollo.MutationResult<CreateCouponMutation>;
export type CreateCouponMutationOptions = Apollo.BaseMutationOptions<CreateCouponMutation, CreateCouponMutationVariables>;
export const UpdateCouponDocument = gql`
    mutation UpdateCoupon($id: Int!, $coupon: CouponInput!) {
  updateCoupon(input: {id: $id, coupon: $coupon}) {
    coupon {
      id
      ...AdminCouponFields
    }
  }
}
    ${AdminCouponFieldsFragmentDoc}`;
export type UpdateCouponMutationFn = Apollo.MutationFunction<UpdateCouponMutation, UpdateCouponMutationVariables>;

/**
 * __useUpdateCouponMutation__
 *
 * To run a mutation, you first call `useUpdateCouponMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateCouponMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateCouponMutation, { data, loading, error }] = useUpdateCouponMutation({
 *   variables: {
 *      id: // value for 'id'
 *      coupon: // value for 'coupon'
 *   },
 * });
 */
export function useUpdateCouponMutation(baseOptions?: Apollo.MutationHookOptions<UpdateCouponMutation, UpdateCouponMutationVariables>) {
        return Apollo.useMutation<UpdateCouponMutation, UpdateCouponMutationVariables>(UpdateCouponDocument, baseOptions);
      }
export type UpdateCouponMutationHookResult = ReturnType<typeof useUpdateCouponMutation>;
export type UpdateCouponMutationResult = Apollo.MutationResult<UpdateCouponMutation>;
export type UpdateCouponMutationOptions = Apollo.BaseMutationOptions<UpdateCouponMutation, UpdateCouponMutationVariables>;
export const DeleteCouponDocument = gql`
    mutation DeleteCoupon($id: Int!) {
  deleteCoupon(input: {id: $id}) {
    clientMutationId
  }
}
    `;
export type DeleteCouponMutationFn = Apollo.MutationFunction<DeleteCouponMutation, DeleteCouponMutationVariables>;

/**
 * __useDeleteCouponMutation__
 *
 * To run a mutation, you first call `useDeleteCouponMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteCouponMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteCouponMutation, { data, loading, error }] = useDeleteCouponMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteCouponMutation(baseOptions?: Apollo.MutationHookOptions<DeleteCouponMutation, DeleteCouponMutationVariables>) {
        return Apollo.useMutation<DeleteCouponMutation, DeleteCouponMutationVariables>(DeleteCouponDocument, baseOptions);
      }
export type DeleteCouponMutationHookResult = ReturnType<typeof useDeleteCouponMutation>;
export type DeleteCouponMutationResult = Apollo.MutationResult<DeleteCouponMutation>;
export type DeleteCouponMutationOptions = Apollo.BaseMutationOptions<DeleteCouponMutation, DeleteCouponMutationVariables>;