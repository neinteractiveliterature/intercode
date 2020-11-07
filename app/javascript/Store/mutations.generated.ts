/* eslint-disable */
import * as Types from '../graphqlTypes.generated';

import { AdminOrderFieldsFragmentFragment, OrderEntryFieldsFragment, CartOrderFieldsFragment, CouponApplicationFieldsFragment } from './orderFields.generated';
import { AdminProductFieldsFragment } from './adminProductFields.generated';
import { gql } from '@apollo/client';
import { AdminOrderFieldsFragmentFragmentDoc, OrderEntryFieldsFragmentDoc, CartOrderFieldsFragmentDoc, CouponApplicationFieldsFragmentDoc } from './orderFields.generated';
import { AdminProductFieldsFragmentDoc } from './adminProductFields.generated';
import * as Apollo from '@apollo/client';
export type MarkOrderPaidMutationVariables = Types.Exact<{
  orderId: Types.Scalars['Int'];
}>;


export type MarkOrderPaidMutation = (
  { __typename: 'Mutation' }
  & { markOrderPaid?: Types.Maybe<(
    { __typename: 'MarkOrderPaidPayload' }
    & { order: (
      { __typename: 'Order' }
      & Pick<Types.Order, 'id'>
      & AdminOrderFieldsFragmentFragment
    ) }
  )> }
);

export type CancelOrderMutationVariables = Types.Exact<{
  orderId: Types.Scalars['Int'];
  skipRefund?: Types.Maybe<Types.Scalars['Boolean']>;
}>;


export type CancelOrderMutation = (
  { __typename: 'Mutation' }
  & { cancelOrder?: Types.Maybe<(
    { __typename: 'CancelOrderPayload' }
    & { order: (
      { __typename: 'Order' }
      & Pick<Types.Order, 'id'>
      & AdminOrderFieldsFragmentFragment
    ) }
  )> }
);

export type CreateOrderMutationVariables = Types.Exact<{
  userConProfileId: Types.Scalars['Int'];
  order: Types.OrderInput;
  status: Types.OrderStatus;
  orderEntries?: Types.Maybe<Array<Types.OrderEntryInput>>;
}>;


export type CreateOrderMutation = (
  { __typename: 'Mutation' }
  & { createOrder?: Types.Maybe<(
    { __typename: 'CreateOrderPayload' }
    & { order: (
      { __typename: 'Order' }
      & Pick<Types.Order, 'id'>
      & AdminOrderFieldsFragmentFragment
    ) }
  )> }
);

export type AdminUpdateOrderMutationVariables = Types.Exact<{
  id: Types.Scalars['Int'];
  order: Types.OrderInput;
}>;


export type AdminUpdateOrderMutation = (
  { __typename: 'Mutation' }
  & { updateOrder?: Types.Maybe<(
    { __typename: 'UpdateOrderPayload' }
    & { order: (
      { __typename: 'Order' }
      & Pick<Types.Order, 'id'>
      & AdminOrderFieldsFragmentFragment
    ) }
  )> }
);

export type CreateProductMutationVariables = Types.Exact<{
  product: Types.ProductInput;
}>;


export type CreateProductMutation = (
  { __typename: 'Mutation' }
  & { createProduct?: Types.Maybe<(
    { __typename: 'CreateProductPayload' }
    & { product: (
      { __typename: 'Product' }
      & Pick<Types.Product, 'id'>
      & AdminProductFieldsFragment
    ) }
  )> }
);

export type UpdateProductMutationVariables = Types.Exact<{
  id: Types.Scalars['Int'];
  product: Types.ProductInput;
}>;


export type UpdateProductMutation = (
  { __typename: 'Mutation' }
  & { updateProduct?: Types.Maybe<(
    { __typename: 'UpdateProductPayload' }
    & { product: (
      { __typename: 'Product' }
      & Pick<Types.Product, 'id'>
      & AdminProductFieldsFragment
    ) }
  )> }
);

export type DeleteProductMutationVariables = Types.Exact<{
  id: Types.Scalars['Int'];
}>;


export type DeleteProductMutation = (
  { __typename: 'Mutation' }
  & { deleteProduct?: Types.Maybe<(
    { __typename: 'DeleteProductPayload' }
    & { product: (
      { __typename: 'Product' }
      & Pick<Types.Product, 'id'>
      & AdminProductFieldsFragment
    ) }
  )> }
);

export type AdminCreateOrderEntryMutationVariables = Types.Exact<{
  input: Types.CreateOrderEntryInput;
}>;


export type AdminCreateOrderEntryMutation = (
  { __typename: 'Mutation' }
  & { createOrderEntry?: Types.Maybe<(
    { __typename: 'CreateOrderEntryPayload' }
    & { order_entry: (
      { __typename: 'OrderEntry' }
      & Pick<Types.OrderEntry, 'id'>
      & { order: (
        { __typename: 'Order' }
        & Pick<Types.Order, 'id'>
        & AdminOrderFieldsFragmentFragment
      ) }
      & OrderEntryFieldsFragment
    ) }
  )> }
);

export type AdminUpdateOrderEntryMutationVariables = Types.Exact<{
  input: Types.UpdateOrderEntryInput;
}>;


export type AdminUpdateOrderEntryMutation = (
  { __typename: 'Mutation' }
  & { updateOrderEntry?: Types.Maybe<(
    { __typename: 'UpdateOrderEntryPayload' }
    & { order_entry: (
      { __typename: 'OrderEntry' }
      & Pick<Types.OrderEntry, 'id'>
      & { order: (
        { __typename: 'Order' }
        & Pick<Types.Order, 'id'>
        & AdminOrderFieldsFragmentFragment
      ) }
      & OrderEntryFieldsFragment
    ) }
  )> }
);

export type UpdateOrderEntryMutationVariables = Types.Exact<{
  input: Types.UpdateOrderEntryInput;
}>;


export type UpdateOrderEntryMutation = (
  { __typename: 'Mutation' }
  & { updateOrderEntry?: Types.Maybe<(
    { __typename: 'UpdateOrderEntryPayload' }
    & { order_entry: (
      { __typename: 'OrderEntry' }
      & Pick<Types.OrderEntry, 'id'>
      & OrderEntryFieldsFragment
    ) }
  )> }
);

export type DeleteOrderEntryMutationVariables = Types.Exact<{
  input: Types.DeleteOrderEntryInput;
}>;


export type DeleteOrderEntryMutation = (
  { __typename: 'Mutation' }
  & { deleteOrderEntry?: Types.Maybe<(
    { __typename: 'DeleteOrderEntryPayload' }
    & { order_entry: (
      { __typename: 'OrderEntry' }
      & Pick<Types.OrderEntry, 'id'>
    ) }
  )> }
);

export type AdminDeleteOrderEntryMutationVariables = Types.Exact<{
  input: Types.DeleteOrderEntryInput;
}>;


export type AdminDeleteOrderEntryMutation = (
  { __typename: 'Mutation' }
  & { deleteOrderEntry?: Types.Maybe<(
    { __typename: 'DeleteOrderEntryPayload' }
    & { order_entry: (
      { __typename: 'OrderEntry' }
      & Pick<Types.OrderEntry, 'id'>
      & { order: (
        { __typename: 'Order' }
        & Pick<Types.Order, 'id'>
        & AdminOrderFieldsFragmentFragment
      ) }
    ) }
  )> }
);

export type SubmitOrderMutationVariables = Types.Exact<{
  input: Types.SubmitOrderInput;
}>;


export type SubmitOrderMutation = (
  { __typename: 'Mutation' }
  & { submitOrder?: Types.Maybe<(
    { __typename: 'SubmitOrderPayload' }
    & { order: (
      { __typename: 'Order' }
      & Pick<Types.Order, 'id' | 'status'>
    ) }
  )> }
);

export type AddOrderEntryToCurrentPendingOrderMutationVariables = Types.Exact<{
  productId: Types.Scalars['Int'];
  productVariantId?: Types.Maybe<Types.Scalars['Int']>;
  quantity: Types.Scalars['Int'];
}>;


export type AddOrderEntryToCurrentPendingOrderMutation = (
  { __typename: 'Mutation' }
  & { addOrderEntryToCurrentPendingOrder?: Types.Maybe<(
    { __typename: 'AddOrderEntryToCurrentPendingOrderPayload' }
    & { order_entry: (
      { __typename: 'OrderEntry' }
      & Pick<Types.OrderEntry, 'id'>
    ) }
  )> }
);

export type CreateCouponApplicationMutationVariables = Types.Exact<{
  orderId: Types.Scalars['Int'];
  couponCode: Types.Scalars['String'];
}>;


export type CreateCouponApplicationMutation = (
  { __typename: 'Mutation' }
  & { createCouponApplication?: Types.Maybe<(
    { __typename: 'CreateCouponApplicationPayload' }
    & { coupon_application: (
      { __typename: 'CouponApplication' }
      & Pick<Types.CouponApplication, 'id'>
      & { order: (
        { __typename: 'Order' }
        & Pick<Types.Order, 'id'>
        & CartOrderFieldsFragment
      ) }
    ) }
  )> }
);

export type DeleteCouponApplicationMutationVariables = Types.Exact<{
  id: Types.Scalars['Int'];
}>;


export type DeleteCouponApplicationMutation = (
  { __typename: 'Mutation' }
  & { deleteCouponApplication?: Types.Maybe<(
    { __typename: 'DeleteCouponApplicationPayload' }
    & { coupon_application: (
      { __typename: 'CouponApplication' }
      & Pick<Types.CouponApplication, 'id'>
      & { order: (
        { __typename: 'Order' }
        & Pick<Types.Order, 'id'>
        & CartOrderFieldsFragment
      ) }
    ) }
  )> }
);


export const MarkOrderPaidDocument = gql`
    mutation MarkOrderPaid($orderId: Int!) {
  markOrderPaid(input: {id: $orderId}) {
    order {
      id
      ...AdminOrderFieldsFragment
    }
  }
}
    ${AdminOrderFieldsFragmentFragmentDoc}`;
export type MarkOrderPaidMutationFn = Apollo.MutationFunction<MarkOrderPaidMutation, MarkOrderPaidMutationVariables>;

/**
 * __useMarkOrderPaidMutation__
 *
 * To run a mutation, you first call `useMarkOrderPaidMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useMarkOrderPaidMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [markOrderPaidMutation, { data, loading, error }] = useMarkOrderPaidMutation({
 *   variables: {
 *      orderId: // value for 'orderId'
 *   },
 * });
 */
export function useMarkOrderPaidMutation(baseOptions?: Apollo.MutationHookOptions<MarkOrderPaidMutation, MarkOrderPaidMutationVariables>) {
        return Apollo.useMutation<MarkOrderPaidMutation, MarkOrderPaidMutationVariables>(MarkOrderPaidDocument, baseOptions);
      }
export type MarkOrderPaidMutationHookResult = ReturnType<typeof useMarkOrderPaidMutation>;
export type MarkOrderPaidMutationResult = Apollo.MutationResult<MarkOrderPaidMutation>;
export type MarkOrderPaidMutationOptions = Apollo.BaseMutationOptions<MarkOrderPaidMutation, MarkOrderPaidMutationVariables>;
export const CancelOrderDocument = gql`
    mutation CancelOrder($orderId: Int!, $skipRefund: Boolean) {
  cancelOrder(input: {id: $orderId, skip_refund: $skipRefund}) {
    order {
      id
      ...AdminOrderFieldsFragment
    }
  }
}
    ${AdminOrderFieldsFragmentFragmentDoc}`;
export type CancelOrderMutationFn = Apollo.MutationFunction<CancelOrderMutation, CancelOrderMutationVariables>;

/**
 * __useCancelOrderMutation__
 *
 * To run a mutation, you first call `useCancelOrderMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCancelOrderMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [cancelOrderMutation, { data, loading, error }] = useCancelOrderMutation({
 *   variables: {
 *      orderId: // value for 'orderId'
 *      skipRefund: // value for 'skipRefund'
 *   },
 * });
 */
export function useCancelOrderMutation(baseOptions?: Apollo.MutationHookOptions<CancelOrderMutation, CancelOrderMutationVariables>) {
        return Apollo.useMutation<CancelOrderMutation, CancelOrderMutationVariables>(CancelOrderDocument, baseOptions);
      }
export type CancelOrderMutationHookResult = ReturnType<typeof useCancelOrderMutation>;
export type CancelOrderMutationResult = Apollo.MutationResult<CancelOrderMutation>;
export type CancelOrderMutationOptions = Apollo.BaseMutationOptions<CancelOrderMutation, CancelOrderMutationVariables>;
export const CreateOrderDocument = gql`
    mutation CreateOrder($userConProfileId: Int!, $order: OrderInput!, $status: OrderStatus!, $orderEntries: [OrderEntryInput!]) {
  createOrder(
    input: {user_con_profile_id: $userConProfileId, order: $order, status: $status, order_entries: $orderEntries}
  ) {
    order {
      id
      ...AdminOrderFieldsFragment
    }
  }
}
    ${AdminOrderFieldsFragmentFragmentDoc}`;
export type CreateOrderMutationFn = Apollo.MutationFunction<CreateOrderMutation, CreateOrderMutationVariables>;

/**
 * __useCreateOrderMutation__
 *
 * To run a mutation, you first call `useCreateOrderMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateOrderMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createOrderMutation, { data, loading, error }] = useCreateOrderMutation({
 *   variables: {
 *      userConProfileId: // value for 'userConProfileId'
 *      order: // value for 'order'
 *      status: // value for 'status'
 *      orderEntries: // value for 'orderEntries'
 *   },
 * });
 */
export function useCreateOrderMutation(baseOptions?: Apollo.MutationHookOptions<CreateOrderMutation, CreateOrderMutationVariables>) {
        return Apollo.useMutation<CreateOrderMutation, CreateOrderMutationVariables>(CreateOrderDocument, baseOptions);
      }
export type CreateOrderMutationHookResult = ReturnType<typeof useCreateOrderMutation>;
export type CreateOrderMutationResult = Apollo.MutationResult<CreateOrderMutation>;
export type CreateOrderMutationOptions = Apollo.BaseMutationOptions<CreateOrderMutation, CreateOrderMutationVariables>;
export const AdminUpdateOrderDocument = gql`
    mutation AdminUpdateOrder($id: Int!, $order: OrderInput!) {
  updateOrder(input: {id: $id, order: $order}) {
    order {
      id
      ...AdminOrderFieldsFragment
    }
  }
}
    ${AdminOrderFieldsFragmentFragmentDoc}`;
export type AdminUpdateOrderMutationFn = Apollo.MutationFunction<AdminUpdateOrderMutation, AdminUpdateOrderMutationVariables>;

/**
 * __useAdminUpdateOrderMutation__
 *
 * To run a mutation, you first call `useAdminUpdateOrderMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAdminUpdateOrderMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [adminUpdateOrderMutation, { data, loading, error }] = useAdminUpdateOrderMutation({
 *   variables: {
 *      id: // value for 'id'
 *      order: // value for 'order'
 *   },
 * });
 */
export function useAdminUpdateOrderMutation(baseOptions?: Apollo.MutationHookOptions<AdminUpdateOrderMutation, AdminUpdateOrderMutationVariables>) {
        return Apollo.useMutation<AdminUpdateOrderMutation, AdminUpdateOrderMutationVariables>(AdminUpdateOrderDocument, baseOptions);
      }
export type AdminUpdateOrderMutationHookResult = ReturnType<typeof useAdminUpdateOrderMutation>;
export type AdminUpdateOrderMutationResult = Apollo.MutationResult<AdminUpdateOrderMutation>;
export type AdminUpdateOrderMutationOptions = Apollo.BaseMutationOptions<AdminUpdateOrderMutation, AdminUpdateOrderMutationVariables>;
export const CreateProductDocument = gql`
    mutation CreateProduct($product: ProductInput!) {
  createProduct(input: {product: $product}) {
    product {
      id
      ...AdminProductFields
    }
  }
}
    ${AdminProductFieldsFragmentDoc}`;
export type CreateProductMutationFn = Apollo.MutationFunction<CreateProductMutation, CreateProductMutationVariables>;

/**
 * __useCreateProductMutation__
 *
 * To run a mutation, you first call `useCreateProductMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateProductMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createProductMutation, { data, loading, error }] = useCreateProductMutation({
 *   variables: {
 *      product: // value for 'product'
 *   },
 * });
 */
export function useCreateProductMutation(baseOptions?: Apollo.MutationHookOptions<CreateProductMutation, CreateProductMutationVariables>) {
        return Apollo.useMutation<CreateProductMutation, CreateProductMutationVariables>(CreateProductDocument, baseOptions);
      }
export type CreateProductMutationHookResult = ReturnType<typeof useCreateProductMutation>;
export type CreateProductMutationResult = Apollo.MutationResult<CreateProductMutation>;
export type CreateProductMutationOptions = Apollo.BaseMutationOptions<CreateProductMutation, CreateProductMutationVariables>;
export const UpdateProductDocument = gql`
    mutation UpdateProduct($id: Int!, $product: ProductInput!) {
  updateProduct(input: {id: $id, product: $product}) {
    product {
      id
      ...AdminProductFields
    }
  }
}
    ${AdminProductFieldsFragmentDoc}`;
export type UpdateProductMutationFn = Apollo.MutationFunction<UpdateProductMutation, UpdateProductMutationVariables>;

/**
 * __useUpdateProductMutation__
 *
 * To run a mutation, you first call `useUpdateProductMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateProductMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateProductMutation, { data, loading, error }] = useUpdateProductMutation({
 *   variables: {
 *      id: // value for 'id'
 *      product: // value for 'product'
 *   },
 * });
 */
export function useUpdateProductMutation(baseOptions?: Apollo.MutationHookOptions<UpdateProductMutation, UpdateProductMutationVariables>) {
        return Apollo.useMutation<UpdateProductMutation, UpdateProductMutationVariables>(UpdateProductDocument, baseOptions);
      }
export type UpdateProductMutationHookResult = ReturnType<typeof useUpdateProductMutation>;
export type UpdateProductMutationResult = Apollo.MutationResult<UpdateProductMutation>;
export type UpdateProductMutationOptions = Apollo.BaseMutationOptions<UpdateProductMutation, UpdateProductMutationVariables>;
export const DeleteProductDocument = gql`
    mutation DeleteProduct($id: Int!) {
  deleteProduct(input: {id: $id}) {
    product {
      id
      ...AdminProductFields
    }
  }
}
    ${AdminProductFieldsFragmentDoc}`;
export type DeleteProductMutationFn = Apollo.MutationFunction<DeleteProductMutation, DeleteProductMutationVariables>;

/**
 * __useDeleteProductMutation__
 *
 * To run a mutation, you first call `useDeleteProductMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteProductMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteProductMutation, { data, loading, error }] = useDeleteProductMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteProductMutation(baseOptions?: Apollo.MutationHookOptions<DeleteProductMutation, DeleteProductMutationVariables>) {
        return Apollo.useMutation<DeleteProductMutation, DeleteProductMutationVariables>(DeleteProductDocument, baseOptions);
      }
export type DeleteProductMutationHookResult = ReturnType<typeof useDeleteProductMutation>;
export type DeleteProductMutationResult = Apollo.MutationResult<DeleteProductMutation>;
export type DeleteProductMutationOptions = Apollo.BaseMutationOptions<DeleteProductMutation, DeleteProductMutationVariables>;
export const AdminCreateOrderEntryDocument = gql`
    mutation AdminCreateOrderEntry($input: CreateOrderEntryInput!) {
  createOrderEntry(input: $input) {
    order_entry {
      id
      ...OrderEntryFields
      order {
        id
        ...AdminOrderFieldsFragment
      }
    }
  }
}
    ${OrderEntryFieldsFragmentDoc}
${AdminOrderFieldsFragmentFragmentDoc}`;
export type AdminCreateOrderEntryMutationFn = Apollo.MutationFunction<AdminCreateOrderEntryMutation, AdminCreateOrderEntryMutationVariables>;

/**
 * __useAdminCreateOrderEntryMutation__
 *
 * To run a mutation, you first call `useAdminCreateOrderEntryMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAdminCreateOrderEntryMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [adminCreateOrderEntryMutation, { data, loading, error }] = useAdminCreateOrderEntryMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useAdminCreateOrderEntryMutation(baseOptions?: Apollo.MutationHookOptions<AdminCreateOrderEntryMutation, AdminCreateOrderEntryMutationVariables>) {
        return Apollo.useMutation<AdminCreateOrderEntryMutation, AdminCreateOrderEntryMutationVariables>(AdminCreateOrderEntryDocument, baseOptions);
      }
export type AdminCreateOrderEntryMutationHookResult = ReturnType<typeof useAdminCreateOrderEntryMutation>;
export type AdminCreateOrderEntryMutationResult = Apollo.MutationResult<AdminCreateOrderEntryMutation>;
export type AdminCreateOrderEntryMutationOptions = Apollo.BaseMutationOptions<AdminCreateOrderEntryMutation, AdminCreateOrderEntryMutationVariables>;
export const AdminUpdateOrderEntryDocument = gql`
    mutation AdminUpdateOrderEntry($input: UpdateOrderEntryInput!) {
  updateOrderEntry(input: $input) {
    order_entry {
      id
      ...OrderEntryFields
      order {
        id
        ...AdminOrderFieldsFragment
      }
    }
  }
}
    ${OrderEntryFieldsFragmentDoc}
${AdminOrderFieldsFragmentFragmentDoc}`;
export type AdminUpdateOrderEntryMutationFn = Apollo.MutationFunction<AdminUpdateOrderEntryMutation, AdminUpdateOrderEntryMutationVariables>;

/**
 * __useAdminUpdateOrderEntryMutation__
 *
 * To run a mutation, you first call `useAdminUpdateOrderEntryMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAdminUpdateOrderEntryMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [adminUpdateOrderEntryMutation, { data, loading, error }] = useAdminUpdateOrderEntryMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useAdminUpdateOrderEntryMutation(baseOptions?: Apollo.MutationHookOptions<AdminUpdateOrderEntryMutation, AdminUpdateOrderEntryMutationVariables>) {
        return Apollo.useMutation<AdminUpdateOrderEntryMutation, AdminUpdateOrderEntryMutationVariables>(AdminUpdateOrderEntryDocument, baseOptions);
      }
export type AdminUpdateOrderEntryMutationHookResult = ReturnType<typeof useAdminUpdateOrderEntryMutation>;
export type AdminUpdateOrderEntryMutationResult = Apollo.MutationResult<AdminUpdateOrderEntryMutation>;
export type AdminUpdateOrderEntryMutationOptions = Apollo.BaseMutationOptions<AdminUpdateOrderEntryMutation, AdminUpdateOrderEntryMutationVariables>;
export const UpdateOrderEntryDocument = gql`
    mutation UpdateOrderEntry($input: UpdateOrderEntryInput!) {
  updateOrderEntry(input: $input) {
    order_entry {
      id
      ...OrderEntryFields
    }
  }
}
    ${OrderEntryFieldsFragmentDoc}`;
export type UpdateOrderEntryMutationFn = Apollo.MutationFunction<UpdateOrderEntryMutation, UpdateOrderEntryMutationVariables>;

/**
 * __useUpdateOrderEntryMutation__
 *
 * To run a mutation, you first call `useUpdateOrderEntryMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateOrderEntryMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateOrderEntryMutation, { data, loading, error }] = useUpdateOrderEntryMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateOrderEntryMutation(baseOptions?: Apollo.MutationHookOptions<UpdateOrderEntryMutation, UpdateOrderEntryMutationVariables>) {
        return Apollo.useMutation<UpdateOrderEntryMutation, UpdateOrderEntryMutationVariables>(UpdateOrderEntryDocument, baseOptions);
      }
export type UpdateOrderEntryMutationHookResult = ReturnType<typeof useUpdateOrderEntryMutation>;
export type UpdateOrderEntryMutationResult = Apollo.MutationResult<UpdateOrderEntryMutation>;
export type UpdateOrderEntryMutationOptions = Apollo.BaseMutationOptions<UpdateOrderEntryMutation, UpdateOrderEntryMutationVariables>;
export const DeleteOrderEntryDocument = gql`
    mutation DeleteOrderEntry($input: DeleteOrderEntryInput!) {
  deleteOrderEntry(input: $input) {
    order_entry {
      id
    }
  }
}
    `;
export type DeleteOrderEntryMutationFn = Apollo.MutationFunction<DeleteOrderEntryMutation, DeleteOrderEntryMutationVariables>;

/**
 * __useDeleteOrderEntryMutation__
 *
 * To run a mutation, you first call `useDeleteOrderEntryMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteOrderEntryMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteOrderEntryMutation, { data, loading, error }] = useDeleteOrderEntryMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useDeleteOrderEntryMutation(baseOptions?: Apollo.MutationHookOptions<DeleteOrderEntryMutation, DeleteOrderEntryMutationVariables>) {
        return Apollo.useMutation<DeleteOrderEntryMutation, DeleteOrderEntryMutationVariables>(DeleteOrderEntryDocument, baseOptions);
      }
export type DeleteOrderEntryMutationHookResult = ReturnType<typeof useDeleteOrderEntryMutation>;
export type DeleteOrderEntryMutationResult = Apollo.MutationResult<DeleteOrderEntryMutation>;
export type DeleteOrderEntryMutationOptions = Apollo.BaseMutationOptions<DeleteOrderEntryMutation, DeleteOrderEntryMutationVariables>;
export const AdminDeleteOrderEntryDocument = gql`
    mutation AdminDeleteOrderEntry($input: DeleteOrderEntryInput!) {
  deleteOrderEntry(input: $input) {
    order_entry {
      id
      order {
        id
        ...AdminOrderFieldsFragment
      }
    }
  }
}
    ${AdminOrderFieldsFragmentFragmentDoc}`;
export type AdminDeleteOrderEntryMutationFn = Apollo.MutationFunction<AdminDeleteOrderEntryMutation, AdminDeleteOrderEntryMutationVariables>;

/**
 * __useAdminDeleteOrderEntryMutation__
 *
 * To run a mutation, you first call `useAdminDeleteOrderEntryMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAdminDeleteOrderEntryMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [adminDeleteOrderEntryMutation, { data, loading, error }] = useAdminDeleteOrderEntryMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useAdminDeleteOrderEntryMutation(baseOptions?: Apollo.MutationHookOptions<AdminDeleteOrderEntryMutation, AdminDeleteOrderEntryMutationVariables>) {
        return Apollo.useMutation<AdminDeleteOrderEntryMutation, AdminDeleteOrderEntryMutationVariables>(AdminDeleteOrderEntryDocument, baseOptions);
      }
export type AdminDeleteOrderEntryMutationHookResult = ReturnType<typeof useAdminDeleteOrderEntryMutation>;
export type AdminDeleteOrderEntryMutationResult = Apollo.MutationResult<AdminDeleteOrderEntryMutation>;
export type AdminDeleteOrderEntryMutationOptions = Apollo.BaseMutationOptions<AdminDeleteOrderEntryMutation, AdminDeleteOrderEntryMutationVariables>;
export const SubmitOrderDocument = gql`
    mutation SubmitOrder($input: SubmitOrderInput!) {
  submitOrder(input: $input) {
    order {
      id
      status
    }
  }
}
    `;
export type SubmitOrderMutationFn = Apollo.MutationFunction<SubmitOrderMutation, SubmitOrderMutationVariables>;

/**
 * __useSubmitOrderMutation__
 *
 * To run a mutation, you first call `useSubmitOrderMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSubmitOrderMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [submitOrderMutation, { data, loading, error }] = useSubmitOrderMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useSubmitOrderMutation(baseOptions?: Apollo.MutationHookOptions<SubmitOrderMutation, SubmitOrderMutationVariables>) {
        return Apollo.useMutation<SubmitOrderMutation, SubmitOrderMutationVariables>(SubmitOrderDocument, baseOptions);
      }
export type SubmitOrderMutationHookResult = ReturnType<typeof useSubmitOrderMutation>;
export type SubmitOrderMutationResult = Apollo.MutationResult<SubmitOrderMutation>;
export type SubmitOrderMutationOptions = Apollo.BaseMutationOptions<SubmitOrderMutation, SubmitOrderMutationVariables>;
export const AddOrderEntryToCurrentPendingOrderDocument = gql`
    mutation AddOrderEntryToCurrentPendingOrder($productId: Int!, $productVariantId: Int, $quantity: Int!) {
  addOrderEntryToCurrentPendingOrder(
    input: {order_entry: {product_id: $productId, product_variant_id: $productVariantId, quantity: $quantity}}
  ) {
    order_entry {
      id
    }
  }
}
    `;
export type AddOrderEntryToCurrentPendingOrderMutationFn = Apollo.MutationFunction<AddOrderEntryToCurrentPendingOrderMutation, AddOrderEntryToCurrentPendingOrderMutationVariables>;

/**
 * __useAddOrderEntryToCurrentPendingOrderMutation__
 *
 * To run a mutation, you first call `useAddOrderEntryToCurrentPendingOrderMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddOrderEntryToCurrentPendingOrderMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addOrderEntryToCurrentPendingOrderMutation, { data, loading, error }] = useAddOrderEntryToCurrentPendingOrderMutation({
 *   variables: {
 *      productId: // value for 'productId'
 *      productVariantId: // value for 'productVariantId'
 *      quantity: // value for 'quantity'
 *   },
 * });
 */
export function useAddOrderEntryToCurrentPendingOrderMutation(baseOptions?: Apollo.MutationHookOptions<AddOrderEntryToCurrentPendingOrderMutation, AddOrderEntryToCurrentPendingOrderMutationVariables>) {
        return Apollo.useMutation<AddOrderEntryToCurrentPendingOrderMutation, AddOrderEntryToCurrentPendingOrderMutationVariables>(AddOrderEntryToCurrentPendingOrderDocument, baseOptions);
      }
export type AddOrderEntryToCurrentPendingOrderMutationHookResult = ReturnType<typeof useAddOrderEntryToCurrentPendingOrderMutation>;
export type AddOrderEntryToCurrentPendingOrderMutationResult = Apollo.MutationResult<AddOrderEntryToCurrentPendingOrderMutation>;
export type AddOrderEntryToCurrentPendingOrderMutationOptions = Apollo.BaseMutationOptions<AddOrderEntryToCurrentPendingOrderMutation, AddOrderEntryToCurrentPendingOrderMutationVariables>;
export const CreateCouponApplicationDocument = gql`
    mutation CreateCouponApplication($orderId: Int!, $couponCode: String!) {
  createCouponApplication(input: {order_id: $orderId, coupon_code: $couponCode}) {
    coupon_application {
      id
      order {
        id
        ...CartOrderFields
      }
    }
  }
}
    ${CartOrderFieldsFragmentDoc}`;
export type CreateCouponApplicationMutationFn = Apollo.MutationFunction<CreateCouponApplicationMutation, CreateCouponApplicationMutationVariables>;

/**
 * __useCreateCouponApplicationMutation__
 *
 * To run a mutation, you first call `useCreateCouponApplicationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateCouponApplicationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createCouponApplicationMutation, { data, loading, error }] = useCreateCouponApplicationMutation({
 *   variables: {
 *      orderId: // value for 'orderId'
 *      couponCode: // value for 'couponCode'
 *   },
 * });
 */
export function useCreateCouponApplicationMutation(baseOptions?: Apollo.MutationHookOptions<CreateCouponApplicationMutation, CreateCouponApplicationMutationVariables>) {
        return Apollo.useMutation<CreateCouponApplicationMutation, CreateCouponApplicationMutationVariables>(CreateCouponApplicationDocument, baseOptions);
      }
export type CreateCouponApplicationMutationHookResult = ReturnType<typeof useCreateCouponApplicationMutation>;
export type CreateCouponApplicationMutationResult = Apollo.MutationResult<CreateCouponApplicationMutation>;
export type CreateCouponApplicationMutationOptions = Apollo.BaseMutationOptions<CreateCouponApplicationMutation, CreateCouponApplicationMutationVariables>;
export const DeleteCouponApplicationDocument = gql`
    mutation DeleteCouponApplication($id: Int!) {
  deleteCouponApplication(input: {id: $id}) {
    coupon_application {
      id
      order {
        id
        ...CartOrderFields
      }
    }
  }
}
    ${CartOrderFieldsFragmentDoc}`;
export type DeleteCouponApplicationMutationFn = Apollo.MutationFunction<DeleteCouponApplicationMutation, DeleteCouponApplicationMutationVariables>;

/**
 * __useDeleteCouponApplicationMutation__
 *
 * To run a mutation, you first call `useDeleteCouponApplicationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteCouponApplicationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteCouponApplicationMutation, { data, loading, error }] = useDeleteCouponApplicationMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteCouponApplicationMutation(baseOptions?: Apollo.MutationHookOptions<DeleteCouponApplicationMutation, DeleteCouponApplicationMutationVariables>) {
        return Apollo.useMutation<DeleteCouponApplicationMutation, DeleteCouponApplicationMutationVariables>(DeleteCouponApplicationDocument, baseOptions);
      }
export type DeleteCouponApplicationMutationHookResult = ReturnType<typeof useDeleteCouponApplicationMutation>;
export type DeleteCouponApplicationMutationResult = Apollo.MutationResult<DeleteCouponApplicationMutation>;
export type DeleteCouponApplicationMutationOptions = Apollo.BaseMutationOptions<DeleteCouponApplicationMutation, DeleteCouponApplicationMutationVariables>;