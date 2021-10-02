/* eslint-disable */
import * as Types from '../../graphqlTypes.generated';

import { gql } from '@apollo/client';
import { AdminCouponFieldsFragmentDoc } from './queries.generated';
import * as Apollo from '@apollo/client';
const defaultOptions =  {}
export type CreateCouponMutationVariables = Types.Exact<{
  coupon: Types.CouponInput;
}>;


export type CreateCouponMutationData = { __typename: 'Mutation', createCoupon: { __typename: 'CreateCouponPayload', coupon: { __typename: 'Coupon', id: number, usage_limit?: number | null | undefined, expires_at?: any | null | undefined, code: string, percent_discount?: any | null | undefined, fixed_amount?: { __typename: 'Money', fractional: number, currency_code: string } | null | undefined, provides_product?: { __typename: 'Product', id: number, name: string } | null | undefined } } };

export type UpdateCouponMutationVariables = Types.Exact<{
  id: Types.Scalars['Int'];
  coupon: Types.CouponInput;
}>;


export type UpdateCouponMutationData = { __typename: 'Mutation', updateCoupon: { __typename: 'UpdateCouponPayload', coupon: { __typename: 'Coupon', id: number, usage_limit?: number | null | undefined, expires_at?: any | null | undefined, code: string, percent_discount?: any | null | undefined, fixed_amount?: { __typename: 'Money', fractional: number, currency_code: string } | null | undefined, provides_product?: { __typename: 'Product', id: number, name: string } | null | undefined } } };

export type DeleteCouponMutationVariables = Types.Exact<{
  id: Types.Scalars['Int'];
}>;


export type DeleteCouponMutationData = { __typename: 'Mutation', deleteCoupon: { __typename: 'DeleteCouponPayload', clientMutationId?: string | null | undefined } };


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
export type CreateCouponMutationFn = Apollo.MutationFunction<CreateCouponMutationData, CreateCouponMutationVariables>;

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
export function useCreateCouponMutation(baseOptions?: Apollo.MutationHookOptions<CreateCouponMutationData, CreateCouponMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateCouponMutationData, CreateCouponMutationVariables>(CreateCouponDocument, options);
      }
export type CreateCouponMutationHookResult = ReturnType<typeof useCreateCouponMutation>;
export type CreateCouponMutationResult = Apollo.MutationResult<CreateCouponMutationData>;
export type CreateCouponMutationOptions = Apollo.BaseMutationOptions<CreateCouponMutationData, CreateCouponMutationVariables>;
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
export type UpdateCouponMutationFn = Apollo.MutationFunction<UpdateCouponMutationData, UpdateCouponMutationVariables>;

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
export function useUpdateCouponMutation(baseOptions?: Apollo.MutationHookOptions<UpdateCouponMutationData, UpdateCouponMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateCouponMutationData, UpdateCouponMutationVariables>(UpdateCouponDocument, options);
      }
export type UpdateCouponMutationHookResult = ReturnType<typeof useUpdateCouponMutation>;
export type UpdateCouponMutationResult = Apollo.MutationResult<UpdateCouponMutationData>;
export type UpdateCouponMutationOptions = Apollo.BaseMutationOptions<UpdateCouponMutationData, UpdateCouponMutationVariables>;
export const DeleteCouponDocument = gql`
    mutation DeleteCoupon($id: Int!) {
  deleteCoupon(input: {id: $id}) {
    clientMutationId
  }
}
    `;
export type DeleteCouponMutationFn = Apollo.MutationFunction<DeleteCouponMutationData, DeleteCouponMutationVariables>;

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
export function useDeleteCouponMutation(baseOptions?: Apollo.MutationHookOptions<DeleteCouponMutationData, DeleteCouponMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteCouponMutationData, DeleteCouponMutationVariables>(DeleteCouponDocument, options);
      }
export type DeleteCouponMutationHookResult = ReturnType<typeof useDeleteCouponMutation>;
export type DeleteCouponMutationResult = Apollo.MutationResult<DeleteCouponMutationData>;
export type DeleteCouponMutationOptions = Apollo.BaseMutationOptions<DeleteCouponMutationData, DeleteCouponMutationVariables>;