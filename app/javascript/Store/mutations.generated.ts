/* eslint-disable */
import * as Types from '../graphqlTypes.generated';

import { gql } from '@apollo/client';
import { AdminOrderFieldsFragmentDoc } from './orderFields.generated';
import { AdminProductFieldsFragmentDoc } from './adminProductFields.generated';
import { OrderEntryFieldsFragmentDoc } from './orderFields.generated';
import { CartOrderFieldsFragmentDoc } from './orderFields.generated';
import * as Apollo from '@apollo/client';
const defaultOptions =  {}
export type MarkOrderPaidMutationVariables = Types.Exact<{
  orderId: Types.Scalars['Int'];
}>;


export type MarkOrderPaidMutationData = { __typename: 'Mutation', markOrderPaid: { __typename: 'MarkOrderPaidPayload', order: { __typename: 'Order', id: number, status: Types.OrderStatus, submitted_at?: any | null | undefined, charge_id?: string | null | undefined, payment_note?: string | null | undefined, user_con_profile: { __typename: 'UserConProfile', id: number, name_without_nickname: string }, total_price: { __typename: 'Money', fractional: number, currency_code: string }, payment_amount?: { __typename: 'Money', fractional: number, currency_code: string } | null | undefined, coupon_applications: Array<{ __typename: 'CouponApplication', id: number, discount: { __typename: 'Money', fractional: number, currency_code: string }, coupon: { __typename: 'Coupon', id: number, code: string, percent_discount?: any | null | undefined, fixed_amount?: { __typename: 'Money', fractional: number, currency_code: string } | null | undefined, provides_product?: { __typename: 'Product', id: number, name: string } | null | undefined } }>, order_entries: Array<{ __typename: 'OrderEntry', id: number, quantity: number, describe_products: string, product: { __typename: 'Product', id: number, name: string }, product_variant?: { __typename: 'ProductVariant', id: number, name: string } | null | undefined, price_per_item: { __typename: 'Money', fractional: number, currency_code: string } }> } } };

export type CancelOrderMutationVariables = Types.Exact<{
  orderId: Types.Scalars['Int'];
  skipRefund?: Types.Maybe<Types.Scalars['Boolean']>;
}>;


export type CancelOrderMutationData = { __typename: 'Mutation', cancelOrder: { __typename: 'CancelOrderPayload', order: { __typename: 'Order', id: number, status: Types.OrderStatus, submitted_at?: any | null | undefined, charge_id?: string | null | undefined, payment_note?: string | null | undefined, user_con_profile: { __typename: 'UserConProfile', id: number, name_without_nickname: string }, total_price: { __typename: 'Money', fractional: number, currency_code: string }, payment_amount?: { __typename: 'Money', fractional: number, currency_code: string } | null | undefined, coupon_applications: Array<{ __typename: 'CouponApplication', id: number, discount: { __typename: 'Money', fractional: number, currency_code: string }, coupon: { __typename: 'Coupon', id: number, code: string, percent_discount?: any | null | undefined, fixed_amount?: { __typename: 'Money', fractional: number, currency_code: string } | null | undefined, provides_product?: { __typename: 'Product', id: number, name: string } | null | undefined } }>, order_entries: Array<{ __typename: 'OrderEntry', id: number, quantity: number, describe_products: string, product: { __typename: 'Product', id: number, name: string }, product_variant?: { __typename: 'ProductVariant', id: number, name: string } | null | undefined, price_per_item: { __typename: 'Money', fractional: number, currency_code: string } }> } } };

export type CreateOrderMutationVariables = Types.Exact<{
  userConProfileId: Types.Scalars['Int'];
  order: Types.OrderInput;
  status: Types.OrderStatus;
  orderEntries?: Types.Maybe<Array<Types.OrderEntryInput> | Types.OrderEntryInput>;
}>;


export type CreateOrderMutationData = { __typename: 'Mutation', createOrder: { __typename: 'CreateOrderPayload', order: { __typename: 'Order', id: number, status: Types.OrderStatus, submitted_at?: any | null | undefined, charge_id?: string | null | undefined, payment_note?: string | null | undefined, user_con_profile: { __typename: 'UserConProfile', id: number, name_without_nickname: string }, total_price: { __typename: 'Money', fractional: number, currency_code: string }, payment_amount?: { __typename: 'Money', fractional: number, currency_code: string } | null | undefined, coupon_applications: Array<{ __typename: 'CouponApplication', id: number, discount: { __typename: 'Money', fractional: number, currency_code: string }, coupon: { __typename: 'Coupon', id: number, code: string, percent_discount?: any | null | undefined, fixed_amount?: { __typename: 'Money', fractional: number, currency_code: string } | null | undefined, provides_product?: { __typename: 'Product', id: number, name: string } | null | undefined } }>, order_entries: Array<{ __typename: 'OrderEntry', id: number, quantity: number, describe_products: string, product: { __typename: 'Product', id: number, name: string }, product_variant?: { __typename: 'ProductVariant', id: number, name: string } | null | undefined, price_per_item: { __typename: 'Money', fractional: number, currency_code: string } }> } } };

export type AdminUpdateOrderMutationVariables = Types.Exact<{
  id: Types.Scalars['Int'];
  order: Types.OrderInput;
}>;


export type AdminUpdateOrderMutationData = { __typename: 'Mutation', updateOrder: { __typename: 'UpdateOrderPayload', order: { __typename: 'Order', id: number, status: Types.OrderStatus, submitted_at?: any | null | undefined, charge_id?: string | null | undefined, payment_note?: string | null | undefined, user_con_profile: { __typename: 'UserConProfile', id: number, name_without_nickname: string }, total_price: { __typename: 'Money', fractional: number, currency_code: string }, payment_amount?: { __typename: 'Money', fractional: number, currency_code: string } | null | undefined, coupon_applications: Array<{ __typename: 'CouponApplication', id: number, discount: { __typename: 'Money', fractional: number, currency_code: string }, coupon: { __typename: 'Coupon', id: number, code: string, percent_discount?: any | null | undefined, fixed_amount?: { __typename: 'Money', fractional: number, currency_code: string } | null | undefined, provides_product?: { __typename: 'Product', id: number, name: string } | null | undefined } }>, order_entries: Array<{ __typename: 'OrderEntry', id: number, quantity: number, describe_products: string, product: { __typename: 'Product', id: number, name: string }, product_variant?: { __typename: 'ProductVariant', id: number, name: string } | null | undefined, price_per_item: { __typename: 'Money', fractional: number, currency_code: string } }> } } };

export type CreateProductMutationVariables = Types.Exact<{
  product: Types.ProductInput;
}>;


export type CreateProductMutationData = { __typename: 'Mutation', createProduct: { __typename: 'CreateProductPayload', product: { __typename: 'Product', id: number, name: string, description?: string | null | undefined, description_html?: string | null | undefined, image_url?: string | null | undefined, available: boolean, payment_options: Array<string>, pricing_structure: { __typename: 'PricingStructure', pricing_strategy: Types.PricingStrategy, price?: { __typename: 'Money', fractional: number, currency_code: string } | null | undefined, value: { __typename: 'Money', fractional: number, currency_code: string } | { __typename: 'ScheduledMoneyValue', timespans: Array<{ __typename: 'TimespanWithMoneyValue', start?: any | null | undefined, finish?: any | null | undefined, value: { __typename: 'Money', fractional: number, currency_code: string } }> } }, product_variants: Array<{ __typename: 'ProductVariant', id: number, name: string, description?: string | null | undefined, image_url?: string | null | undefined, position?: number | null | undefined, override_pricing_structure?: { __typename: 'PricingStructure', pricing_strategy: Types.PricingStrategy, price?: { __typename: 'Money', fractional: number, currency_code: string } | null | undefined, value: { __typename: 'Money', fractional: number, currency_code: string } | { __typename: 'ScheduledMoneyValue', timespans: Array<{ __typename: 'TimespanWithMoneyValue', start?: any | null | undefined, finish?: any | null | undefined, value: { __typename: 'Money', fractional: number, currency_code: string } }> } } | null | undefined }>, provides_ticket_type?: { __typename: 'TicketType', id: number, description?: string | null | undefined } | null | undefined } } };

export type UpdateProductMutationVariables = Types.Exact<{
  id: Types.Scalars['Int'];
  product: Types.ProductInput;
}>;


export type UpdateProductMutationData = { __typename: 'Mutation', updateProduct: { __typename: 'UpdateProductPayload', product: { __typename: 'Product', id: number, name: string, description?: string | null | undefined, description_html?: string | null | undefined, image_url?: string | null | undefined, available: boolean, payment_options: Array<string>, pricing_structure: { __typename: 'PricingStructure', pricing_strategy: Types.PricingStrategy, price?: { __typename: 'Money', fractional: number, currency_code: string } | null | undefined, value: { __typename: 'Money', fractional: number, currency_code: string } | { __typename: 'ScheduledMoneyValue', timespans: Array<{ __typename: 'TimespanWithMoneyValue', start?: any | null | undefined, finish?: any | null | undefined, value: { __typename: 'Money', fractional: number, currency_code: string } }> } }, product_variants: Array<{ __typename: 'ProductVariant', id: number, name: string, description?: string | null | undefined, image_url?: string | null | undefined, position?: number | null | undefined, override_pricing_structure?: { __typename: 'PricingStructure', pricing_strategy: Types.PricingStrategy, price?: { __typename: 'Money', fractional: number, currency_code: string } | null | undefined, value: { __typename: 'Money', fractional: number, currency_code: string } | { __typename: 'ScheduledMoneyValue', timespans: Array<{ __typename: 'TimespanWithMoneyValue', start?: any | null | undefined, finish?: any | null | undefined, value: { __typename: 'Money', fractional: number, currency_code: string } }> } } | null | undefined }>, provides_ticket_type?: { __typename: 'TicketType', id: number, description?: string | null | undefined } | null | undefined } } };

export type DeleteProductMutationVariables = Types.Exact<{
  id: Types.Scalars['Int'];
}>;


export type DeleteProductMutationData = { __typename: 'Mutation', deleteProduct: { __typename: 'DeleteProductPayload', product: { __typename: 'Product', id: number, name: string, description?: string | null | undefined, description_html?: string | null | undefined, image_url?: string | null | undefined, available: boolean, payment_options: Array<string>, pricing_structure: { __typename: 'PricingStructure', pricing_strategy: Types.PricingStrategy, price?: { __typename: 'Money', fractional: number, currency_code: string } | null | undefined, value: { __typename: 'Money', fractional: number, currency_code: string } | { __typename: 'ScheduledMoneyValue', timespans: Array<{ __typename: 'TimespanWithMoneyValue', start?: any | null | undefined, finish?: any | null | undefined, value: { __typename: 'Money', fractional: number, currency_code: string } }> } }, product_variants: Array<{ __typename: 'ProductVariant', id: number, name: string, description?: string | null | undefined, image_url?: string | null | undefined, position?: number | null | undefined, override_pricing_structure?: { __typename: 'PricingStructure', pricing_strategy: Types.PricingStrategy, price?: { __typename: 'Money', fractional: number, currency_code: string } | null | undefined, value: { __typename: 'Money', fractional: number, currency_code: string } | { __typename: 'ScheduledMoneyValue', timespans: Array<{ __typename: 'TimespanWithMoneyValue', start?: any | null | undefined, finish?: any | null | undefined, value: { __typename: 'Money', fractional: number, currency_code: string } }> } } | null | undefined }>, provides_ticket_type?: { __typename: 'TicketType', id: number, description?: string | null | undefined } | null | undefined } } };

export type AdminCreateOrderEntryMutationVariables = Types.Exact<{
  input: Types.CreateOrderEntryInput;
}>;


export type AdminCreateOrderEntryMutationData = { __typename: 'Mutation', createOrderEntry: { __typename: 'CreateOrderEntryPayload', order_entry: { __typename: 'OrderEntry', id: number, quantity: number, order: { __typename: 'Order', id: number, status: Types.OrderStatus, submitted_at?: any | null | undefined, charge_id?: string | null | undefined, payment_note?: string | null | undefined, user_con_profile: { __typename: 'UserConProfile', id: number, name_without_nickname: string }, total_price: { __typename: 'Money', fractional: number, currency_code: string }, payment_amount?: { __typename: 'Money', fractional: number, currency_code: string } | null | undefined, coupon_applications: Array<{ __typename: 'CouponApplication', id: number, discount: { __typename: 'Money', fractional: number, currency_code: string }, coupon: { __typename: 'Coupon', id: number, code: string, percent_discount?: any | null | undefined, fixed_amount?: { __typename: 'Money', fractional: number, currency_code: string } | null | undefined, provides_product?: { __typename: 'Product', id: number, name: string } | null | undefined } }>, order_entries: Array<{ __typename: 'OrderEntry', id: number, quantity: number, describe_products: string, product: { __typename: 'Product', id: number, name: string }, product_variant?: { __typename: 'ProductVariant', id: number, name: string } | null | undefined, price_per_item: { __typename: 'Money', fractional: number, currency_code: string } }> }, product: { __typename: 'Product', id: number, name: string, payment_options: Array<string>, provides_ticket_type?: { __typename: 'TicketType', id: number } | null | undefined }, product_variant?: { __typename: 'ProductVariant', id: number, name: string } | null | undefined, price: { __typename: 'Money', fractional: number, currency_code: string }, price_per_item: { __typename: 'Money', fractional: number, currency_code: string } } } };

export type AdminUpdateOrderEntryMutationVariables = Types.Exact<{
  input: Types.UpdateOrderEntryInput;
}>;


export type AdminUpdateOrderEntryMutationData = { __typename: 'Mutation', updateOrderEntry: { __typename: 'UpdateOrderEntryPayload', order_entry: { __typename: 'OrderEntry', id: number, quantity: number, order: { __typename: 'Order', id: number, status: Types.OrderStatus, submitted_at?: any | null | undefined, charge_id?: string | null | undefined, payment_note?: string | null | undefined, user_con_profile: { __typename: 'UserConProfile', id: number, name_without_nickname: string }, total_price: { __typename: 'Money', fractional: number, currency_code: string }, payment_amount?: { __typename: 'Money', fractional: number, currency_code: string } | null | undefined, coupon_applications: Array<{ __typename: 'CouponApplication', id: number, discount: { __typename: 'Money', fractional: number, currency_code: string }, coupon: { __typename: 'Coupon', id: number, code: string, percent_discount?: any | null | undefined, fixed_amount?: { __typename: 'Money', fractional: number, currency_code: string } | null | undefined, provides_product?: { __typename: 'Product', id: number, name: string } | null | undefined } }>, order_entries: Array<{ __typename: 'OrderEntry', id: number, quantity: number, describe_products: string, product: { __typename: 'Product', id: number, name: string }, product_variant?: { __typename: 'ProductVariant', id: number, name: string } | null | undefined, price_per_item: { __typename: 'Money', fractional: number, currency_code: string } }> }, product: { __typename: 'Product', id: number, name: string, payment_options: Array<string>, provides_ticket_type?: { __typename: 'TicketType', id: number } | null | undefined }, product_variant?: { __typename: 'ProductVariant', id: number, name: string } | null | undefined, price: { __typename: 'Money', fractional: number, currency_code: string }, price_per_item: { __typename: 'Money', fractional: number, currency_code: string } } } };

export type UpdateOrderEntryMutationVariables = Types.Exact<{
  input: Types.UpdateOrderEntryInput;
}>;


export type UpdateOrderEntryMutationData = { __typename: 'Mutation', updateOrderEntry: { __typename: 'UpdateOrderEntryPayload', order_entry: { __typename: 'OrderEntry', id: number, quantity: number, product: { __typename: 'Product', id: number, name: string, payment_options: Array<string>, provides_ticket_type?: { __typename: 'TicketType', id: number } | null | undefined }, product_variant?: { __typename: 'ProductVariant', id: number, name: string } | null | undefined, price: { __typename: 'Money', fractional: number, currency_code: string }, price_per_item: { __typename: 'Money', fractional: number, currency_code: string } } } };

export type DeleteOrderEntryMutationVariables = Types.Exact<{
  input: Types.DeleteOrderEntryInput;
}>;


export type DeleteOrderEntryMutationData = { __typename: 'Mutation', deleteOrderEntry: { __typename: 'DeleteOrderEntryPayload', order_entry: { __typename: 'OrderEntry', id: number } } };

export type AdminDeleteOrderEntryMutationVariables = Types.Exact<{
  input: Types.DeleteOrderEntryInput;
}>;


export type AdminDeleteOrderEntryMutationData = { __typename: 'Mutation', deleteOrderEntry: { __typename: 'DeleteOrderEntryPayload', order_entry: { __typename: 'OrderEntry', id: number, order: { __typename: 'Order', id: number, status: Types.OrderStatus, submitted_at?: any | null | undefined, charge_id?: string | null | undefined, payment_note?: string | null | undefined, user_con_profile: { __typename: 'UserConProfile', id: number, name_without_nickname: string }, total_price: { __typename: 'Money', fractional: number, currency_code: string }, payment_amount?: { __typename: 'Money', fractional: number, currency_code: string } | null | undefined, coupon_applications: Array<{ __typename: 'CouponApplication', id: number, discount: { __typename: 'Money', fractional: number, currency_code: string }, coupon: { __typename: 'Coupon', id: number, code: string, percent_discount?: any | null | undefined, fixed_amount?: { __typename: 'Money', fractional: number, currency_code: string } | null | undefined, provides_product?: { __typename: 'Product', id: number, name: string } | null | undefined } }>, order_entries: Array<{ __typename: 'OrderEntry', id: number, quantity: number, describe_products: string, product: { __typename: 'Product', id: number, name: string }, product_variant?: { __typename: 'ProductVariant', id: number, name: string } | null | undefined, price_per_item: { __typename: 'Money', fractional: number, currency_code: string } }> } } } };

export type SubmitOrderMutationVariables = Types.Exact<{
  input: Types.SubmitOrderInput;
}>;


export type SubmitOrderMutationData = { __typename: 'Mutation', submitOrder: { __typename: 'SubmitOrderPayload', order: { __typename: 'Order', id: number, status: Types.OrderStatus } } };

export type AddOrderEntryToCurrentPendingOrderMutationVariables = Types.Exact<{
  productId: Types.Scalars['Int'];
  productVariantId?: Types.Maybe<Types.Scalars['Int']>;
  quantity: Types.Scalars['Int'];
}>;


export type AddOrderEntryToCurrentPendingOrderMutationData = { __typename: 'Mutation', addOrderEntryToCurrentPendingOrder: { __typename: 'AddOrderEntryToCurrentPendingOrderPayload', order_entry: { __typename: 'OrderEntry', id: number } } };

export type CreateCouponApplicationMutationVariables = Types.Exact<{
  orderId: Types.Scalars['Int'];
  couponCode: Types.Scalars['String'];
}>;


export type CreateCouponApplicationMutationData = { __typename: 'Mutation', createCouponApplication: { __typename: 'CreateCouponApplicationPayload', coupon_application: { __typename: 'CouponApplication', id: number, order: { __typename: 'Order', id: number, coupon_applications: Array<{ __typename: 'CouponApplication', id: number, discount: { __typename: 'Money', fractional: number, currency_code: string }, coupon: { __typename: 'Coupon', id: number, code: string, percent_discount?: any | null | undefined, fixed_amount?: { __typename: 'Money', fractional: number, currency_code: string } | null | undefined, provides_product?: { __typename: 'Product', id: number, name: string } | null | undefined } }>, total_price_before_discounts: { __typename: 'Money', fractional: number, currency_code: string }, total_price: { __typename: 'Money', fractional: number, currency_code: string }, order_entries: Array<{ __typename: 'OrderEntry', id: number, quantity: number, product: { __typename: 'Product', id: number, name: string, payment_options: Array<string>, provides_ticket_type?: { __typename: 'TicketType', id: number } | null | undefined }, product_variant?: { __typename: 'ProductVariant', id: number, name: string } | null | undefined, price: { __typename: 'Money', fractional: number, currency_code: string }, price_per_item: { __typename: 'Money', fractional: number, currency_code: string } }> } } } };

export type DeleteCouponApplicationMutationVariables = Types.Exact<{
  id: Types.Scalars['Int'];
}>;


export type DeleteCouponApplicationMutationData = { __typename: 'Mutation', deleteCouponApplication: { __typename: 'DeleteCouponApplicationPayload', coupon_application: { __typename: 'CouponApplication', id: number, order: { __typename: 'Order', id: number, coupon_applications: Array<{ __typename: 'CouponApplication', id: number, discount: { __typename: 'Money', fractional: number, currency_code: string }, coupon: { __typename: 'Coupon', id: number, code: string, percent_discount?: any | null | undefined, fixed_amount?: { __typename: 'Money', fractional: number, currency_code: string } | null | undefined, provides_product?: { __typename: 'Product', id: number, name: string } | null | undefined } }>, total_price_before_discounts: { __typename: 'Money', fractional: number, currency_code: string }, total_price: { __typename: 'Money', fractional: number, currency_code: string }, order_entries: Array<{ __typename: 'OrderEntry', id: number, quantity: number, product: { __typename: 'Product', id: number, name: string, payment_options: Array<string>, provides_ticket_type?: { __typename: 'TicketType', id: number } | null | undefined }, product_variant?: { __typename: 'ProductVariant', id: number, name: string } | null | undefined, price: { __typename: 'Money', fractional: number, currency_code: string }, price_per_item: { __typename: 'Money', fractional: number, currency_code: string } }> } } } };


export const MarkOrderPaidDocument = gql`
    mutation MarkOrderPaid($orderId: Int!) {
  markOrderPaid(input: {id: $orderId}) {
    order {
      id
      ...AdminOrderFieldsFragment
    }
  }
}
    ${AdminOrderFieldsFragmentDoc}`;
export type MarkOrderPaidMutationFn = Apollo.MutationFunction<MarkOrderPaidMutationData, MarkOrderPaidMutationVariables>;

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
export function useMarkOrderPaidMutation(baseOptions?: Apollo.MutationHookOptions<MarkOrderPaidMutationData, MarkOrderPaidMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<MarkOrderPaidMutationData, MarkOrderPaidMutationVariables>(MarkOrderPaidDocument, options);
      }
export type MarkOrderPaidMutationHookResult = ReturnType<typeof useMarkOrderPaidMutation>;
export type MarkOrderPaidMutationResult = Apollo.MutationResult<MarkOrderPaidMutationData>;
export type MarkOrderPaidMutationOptions = Apollo.BaseMutationOptions<MarkOrderPaidMutationData, MarkOrderPaidMutationVariables>;
export const CancelOrderDocument = gql`
    mutation CancelOrder($orderId: Int!, $skipRefund: Boolean) {
  cancelOrder(input: {id: $orderId, skip_refund: $skipRefund}) {
    order {
      id
      ...AdminOrderFieldsFragment
    }
  }
}
    ${AdminOrderFieldsFragmentDoc}`;
export type CancelOrderMutationFn = Apollo.MutationFunction<CancelOrderMutationData, CancelOrderMutationVariables>;

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
export function useCancelOrderMutation(baseOptions?: Apollo.MutationHookOptions<CancelOrderMutationData, CancelOrderMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CancelOrderMutationData, CancelOrderMutationVariables>(CancelOrderDocument, options);
      }
export type CancelOrderMutationHookResult = ReturnType<typeof useCancelOrderMutation>;
export type CancelOrderMutationResult = Apollo.MutationResult<CancelOrderMutationData>;
export type CancelOrderMutationOptions = Apollo.BaseMutationOptions<CancelOrderMutationData, CancelOrderMutationVariables>;
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
    ${AdminOrderFieldsFragmentDoc}`;
export type CreateOrderMutationFn = Apollo.MutationFunction<CreateOrderMutationData, CreateOrderMutationVariables>;

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
export function useCreateOrderMutation(baseOptions?: Apollo.MutationHookOptions<CreateOrderMutationData, CreateOrderMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateOrderMutationData, CreateOrderMutationVariables>(CreateOrderDocument, options);
      }
export type CreateOrderMutationHookResult = ReturnType<typeof useCreateOrderMutation>;
export type CreateOrderMutationResult = Apollo.MutationResult<CreateOrderMutationData>;
export type CreateOrderMutationOptions = Apollo.BaseMutationOptions<CreateOrderMutationData, CreateOrderMutationVariables>;
export const AdminUpdateOrderDocument = gql`
    mutation AdminUpdateOrder($id: Int!, $order: OrderInput!) {
  updateOrder(input: {id: $id, order: $order}) {
    order {
      id
      ...AdminOrderFieldsFragment
    }
  }
}
    ${AdminOrderFieldsFragmentDoc}`;
export type AdminUpdateOrderMutationFn = Apollo.MutationFunction<AdminUpdateOrderMutationData, AdminUpdateOrderMutationVariables>;

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
export function useAdminUpdateOrderMutation(baseOptions?: Apollo.MutationHookOptions<AdminUpdateOrderMutationData, AdminUpdateOrderMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AdminUpdateOrderMutationData, AdminUpdateOrderMutationVariables>(AdminUpdateOrderDocument, options);
      }
export type AdminUpdateOrderMutationHookResult = ReturnType<typeof useAdminUpdateOrderMutation>;
export type AdminUpdateOrderMutationResult = Apollo.MutationResult<AdminUpdateOrderMutationData>;
export type AdminUpdateOrderMutationOptions = Apollo.BaseMutationOptions<AdminUpdateOrderMutationData, AdminUpdateOrderMutationVariables>;
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
export type CreateProductMutationFn = Apollo.MutationFunction<CreateProductMutationData, CreateProductMutationVariables>;

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
export function useCreateProductMutation(baseOptions?: Apollo.MutationHookOptions<CreateProductMutationData, CreateProductMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateProductMutationData, CreateProductMutationVariables>(CreateProductDocument, options);
      }
export type CreateProductMutationHookResult = ReturnType<typeof useCreateProductMutation>;
export type CreateProductMutationResult = Apollo.MutationResult<CreateProductMutationData>;
export type CreateProductMutationOptions = Apollo.BaseMutationOptions<CreateProductMutationData, CreateProductMutationVariables>;
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
export type UpdateProductMutationFn = Apollo.MutationFunction<UpdateProductMutationData, UpdateProductMutationVariables>;

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
export function useUpdateProductMutation(baseOptions?: Apollo.MutationHookOptions<UpdateProductMutationData, UpdateProductMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateProductMutationData, UpdateProductMutationVariables>(UpdateProductDocument, options);
      }
export type UpdateProductMutationHookResult = ReturnType<typeof useUpdateProductMutation>;
export type UpdateProductMutationResult = Apollo.MutationResult<UpdateProductMutationData>;
export type UpdateProductMutationOptions = Apollo.BaseMutationOptions<UpdateProductMutationData, UpdateProductMutationVariables>;
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
export type DeleteProductMutationFn = Apollo.MutationFunction<DeleteProductMutationData, DeleteProductMutationVariables>;

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
export function useDeleteProductMutation(baseOptions?: Apollo.MutationHookOptions<DeleteProductMutationData, DeleteProductMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteProductMutationData, DeleteProductMutationVariables>(DeleteProductDocument, options);
      }
export type DeleteProductMutationHookResult = ReturnType<typeof useDeleteProductMutation>;
export type DeleteProductMutationResult = Apollo.MutationResult<DeleteProductMutationData>;
export type DeleteProductMutationOptions = Apollo.BaseMutationOptions<DeleteProductMutationData, DeleteProductMutationVariables>;
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
${AdminOrderFieldsFragmentDoc}`;
export type AdminCreateOrderEntryMutationFn = Apollo.MutationFunction<AdminCreateOrderEntryMutationData, AdminCreateOrderEntryMutationVariables>;

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
export function useAdminCreateOrderEntryMutation(baseOptions?: Apollo.MutationHookOptions<AdminCreateOrderEntryMutationData, AdminCreateOrderEntryMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AdminCreateOrderEntryMutationData, AdminCreateOrderEntryMutationVariables>(AdminCreateOrderEntryDocument, options);
      }
export type AdminCreateOrderEntryMutationHookResult = ReturnType<typeof useAdminCreateOrderEntryMutation>;
export type AdminCreateOrderEntryMutationResult = Apollo.MutationResult<AdminCreateOrderEntryMutationData>;
export type AdminCreateOrderEntryMutationOptions = Apollo.BaseMutationOptions<AdminCreateOrderEntryMutationData, AdminCreateOrderEntryMutationVariables>;
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
${AdminOrderFieldsFragmentDoc}`;
export type AdminUpdateOrderEntryMutationFn = Apollo.MutationFunction<AdminUpdateOrderEntryMutationData, AdminUpdateOrderEntryMutationVariables>;

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
export function useAdminUpdateOrderEntryMutation(baseOptions?: Apollo.MutationHookOptions<AdminUpdateOrderEntryMutationData, AdminUpdateOrderEntryMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AdminUpdateOrderEntryMutationData, AdminUpdateOrderEntryMutationVariables>(AdminUpdateOrderEntryDocument, options);
      }
export type AdminUpdateOrderEntryMutationHookResult = ReturnType<typeof useAdminUpdateOrderEntryMutation>;
export type AdminUpdateOrderEntryMutationResult = Apollo.MutationResult<AdminUpdateOrderEntryMutationData>;
export type AdminUpdateOrderEntryMutationOptions = Apollo.BaseMutationOptions<AdminUpdateOrderEntryMutationData, AdminUpdateOrderEntryMutationVariables>;
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
export type UpdateOrderEntryMutationFn = Apollo.MutationFunction<UpdateOrderEntryMutationData, UpdateOrderEntryMutationVariables>;

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
export function useUpdateOrderEntryMutation(baseOptions?: Apollo.MutationHookOptions<UpdateOrderEntryMutationData, UpdateOrderEntryMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateOrderEntryMutationData, UpdateOrderEntryMutationVariables>(UpdateOrderEntryDocument, options);
      }
export type UpdateOrderEntryMutationHookResult = ReturnType<typeof useUpdateOrderEntryMutation>;
export type UpdateOrderEntryMutationResult = Apollo.MutationResult<UpdateOrderEntryMutationData>;
export type UpdateOrderEntryMutationOptions = Apollo.BaseMutationOptions<UpdateOrderEntryMutationData, UpdateOrderEntryMutationVariables>;
export const DeleteOrderEntryDocument = gql`
    mutation DeleteOrderEntry($input: DeleteOrderEntryInput!) {
  deleteOrderEntry(input: $input) {
    order_entry {
      id
    }
  }
}
    `;
export type DeleteOrderEntryMutationFn = Apollo.MutationFunction<DeleteOrderEntryMutationData, DeleteOrderEntryMutationVariables>;

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
export function useDeleteOrderEntryMutation(baseOptions?: Apollo.MutationHookOptions<DeleteOrderEntryMutationData, DeleteOrderEntryMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteOrderEntryMutationData, DeleteOrderEntryMutationVariables>(DeleteOrderEntryDocument, options);
      }
export type DeleteOrderEntryMutationHookResult = ReturnType<typeof useDeleteOrderEntryMutation>;
export type DeleteOrderEntryMutationResult = Apollo.MutationResult<DeleteOrderEntryMutationData>;
export type DeleteOrderEntryMutationOptions = Apollo.BaseMutationOptions<DeleteOrderEntryMutationData, DeleteOrderEntryMutationVariables>;
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
    ${AdminOrderFieldsFragmentDoc}`;
export type AdminDeleteOrderEntryMutationFn = Apollo.MutationFunction<AdminDeleteOrderEntryMutationData, AdminDeleteOrderEntryMutationVariables>;

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
export function useAdminDeleteOrderEntryMutation(baseOptions?: Apollo.MutationHookOptions<AdminDeleteOrderEntryMutationData, AdminDeleteOrderEntryMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AdminDeleteOrderEntryMutationData, AdminDeleteOrderEntryMutationVariables>(AdminDeleteOrderEntryDocument, options);
      }
export type AdminDeleteOrderEntryMutationHookResult = ReturnType<typeof useAdminDeleteOrderEntryMutation>;
export type AdminDeleteOrderEntryMutationResult = Apollo.MutationResult<AdminDeleteOrderEntryMutationData>;
export type AdminDeleteOrderEntryMutationOptions = Apollo.BaseMutationOptions<AdminDeleteOrderEntryMutationData, AdminDeleteOrderEntryMutationVariables>;
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
export type SubmitOrderMutationFn = Apollo.MutationFunction<SubmitOrderMutationData, SubmitOrderMutationVariables>;

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
export function useSubmitOrderMutation(baseOptions?: Apollo.MutationHookOptions<SubmitOrderMutationData, SubmitOrderMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SubmitOrderMutationData, SubmitOrderMutationVariables>(SubmitOrderDocument, options);
      }
export type SubmitOrderMutationHookResult = ReturnType<typeof useSubmitOrderMutation>;
export type SubmitOrderMutationResult = Apollo.MutationResult<SubmitOrderMutationData>;
export type SubmitOrderMutationOptions = Apollo.BaseMutationOptions<SubmitOrderMutationData, SubmitOrderMutationVariables>;
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
export type AddOrderEntryToCurrentPendingOrderMutationFn = Apollo.MutationFunction<AddOrderEntryToCurrentPendingOrderMutationData, AddOrderEntryToCurrentPendingOrderMutationVariables>;

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
export function useAddOrderEntryToCurrentPendingOrderMutation(baseOptions?: Apollo.MutationHookOptions<AddOrderEntryToCurrentPendingOrderMutationData, AddOrderEntryToCurrentPendingOrderMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AddOrderEntryToCurrentPendingOrderMutationData, AddOrderEntryToCurrentPendingOrderMutationVariables>(AddOrderEntryToCurrentPendingOrderDocument, options);
      }
export type AddOrderEntryToCurrentPendingOrderMutationHookResult = ReturnType<typeof useAddOrderEntryToCurrentPendingOrderMutation>;
export type AddOrderEntryToCurrentPendingOrderMutationResult = Apollo.MutationResult<AddOrderEntryToCurrentPendingOrderMutationData>;
export type AddOrderEntryToCurrentPendingOrderMutationOptions = Apollo.BaseMutationOptions<AddOrderEntryToCurrentPendingOrderMutationData, AddOrderEntryToCurrentPendingOrderMutationVariables>;
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
export type CreateCouponApplicationMutationFn = Apollo.MutationFunction<CreateCouponApplicationMutationData, CreateCouponApplicationMutationVariables>;

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
export function useCreateCouponApplicationMutation(baseOptions?: Apollo.MutationHookOptions<CreateCouponApplicationMutationData, CreateCouponApplicationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateCouponApplicationMutationData, CreateCouponApplicationMutationVariables>(CreateCouponApplicationDocument, options);
      }
export type CreateCouponApplicationMutationHookResult = ReturnType<typeof useCreateCouponApplicationMutation>;
export type CreateCouponApplicationMutationResult = Apollo.MutationResult<CreateCouponApplicationMutationData>;
export type CreateCouponApplicationMutationOptions = Apollo.BaseMutationOptions<CreateCouponApplicationMutationData, CreateCouponApplicationMutationVariables>;
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
export type DeleteCouponApplicationMutationFn = Apollo.MutationFunction<DeleteCouponApplicationMutationData, DeleteCouponApplicationMutationVariables>;

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
export function useDeleteCouponApplicationMutation(baseOptions?: Apollo.MutationHookOptions<DeleteCouponApplicationMutationData, DeleteCouponApplicationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteCouponApplicationMutationData, DeleteCouponApplicationMutationVariables>(DeleteCouponApplicationDocument, options);
      }
export type DeleteCouponApplicationMutationHookResult = ReturnType<typeof useDeleteCouponApplicationMutation>;
export type DeleteCouponApplicationMutationResult = Apollo.MutationResult<DeleteCouponApplicationMutationData>;
export type DeleteCouponApplicationMutationOptions = Apollo.BaseMutationOptions<DeleteCouponApplicationMutationData, DeleteCouponApplicationMutationVariables>;