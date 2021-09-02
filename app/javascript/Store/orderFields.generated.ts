/* eslint-disable */
import * as Types from '../graphqlTypes.generated';

import { gql } from '@apollo/client';
import { CouponFieldsFragmentDoc } from './couponFields.generated';
export type CouponApplicationFieldsFragment = { __typename: 'CouponApplication', id: number, discount: { __typename: 'Money', fractional: number, currency_code: string }, coupon: { __typename: 'Coupon', id: number, code: string, percent_discount?: Types.Maybe<any>, fixed_amount?: Types.Maybe<{ __typename: 'Money', fractional: number, currency_code: string }>, provides_product?: Types.Maybe<{ __typename: 'Product', id: number, name: string }> } };

export type AdminOrderFieldsFragment = { __typename: 'Order', id: number, status: Types.OrderStatus, submitted_at?: Types.Maybe<any>, charge_id?: Types.Maybe<string>, payment_note?: Types.Maybe<string>, user_con_profile: { __typename: 'UserConProfile', id: number, name_without_nickname: string }, total_price: { __typename: 'Money', fractional: number, currency_code: string }, payment_amount?: Types.Maybe<{ __typename: 'Money', fractional: number, currency_code: string }>, coupon_applications: Array<{ __typename: 'CouponApplication', id: number, discount: { __typename: 'Money', fractional: number, currency_code: string }, coupon: { __typename: 'Coupon', id: number, code: string, percent_discount?: Types.Maybe<any>, fixed_amount?: Types.Maybe<{ __typename: 'Money', fractional: number, currency_code: string }>, provides_product?: Types.Maybe<{ __typename: 'Product', id: number, name: string }> } }>, order_entries: Array<{ __typename: 'OrderEntry', id: number, quantity: number, describe_products: string, product: { __typename: 'Product', id: number, name: string }, product_variant?: Types.Maybe<{ __typename: 'ProductVariant', id: number, name: string }>, price_per_item: { __typename: 'Money', fractional: number, currency_code: string } }> };

export type OrderEntryFieldsFragment = { __typename: 'OrderEntry', id: number, quantity: number, product: { __typename: 'Product', id: number, name: string, payment_options: Array<string>, provides_ticket_type?: Types.Maybe<{ __typename: 'TicketType', id: number }> }, product_variant?: Types.Maybe<{ __typename: 'ProductVariant', id: number, name: string }>, price: { __typename: 'Money', fractional: number, currency_code: string }, price_per_item: { __typename: 'Money', fractional: number, currency_code: string } };

export type CartOrderFieldsFragment = { __typename: 'Order', id: number, coupon_applications: Array<{ __typename: 'CouponApplication', id: number, discount: { __typename: 'Money', fractional: number, currency_code: string }, coupon: { __typename: 'Coupon', id: number, code: string, percent_discount?: Types.Maybe<any>, fixed_amount?: Types.Maybe<{ __typename: 'Money', fractional: number, currency_code: string }>, provides_product?: Types.Maybe<{ __typename: 'Product', id: number, name: string }> } }>, total_price_before_discounts: { __typename: 'Money', fractional: number, currency_code: string }, total_price: { __typename: 'Money', fractional: number, currency_code: string }, order_entries: Array<{ __typename: 'OrderEntry', id: number, quantity: number, product: { __typename: 'Product', id: number, name: string, payment_options: Array<string>, provides_ticket_type?: Types.Maybe<{ __typename: 'TicketType', id: number }> }, product_variant?: Types.Maybe<{ __typename: 'ProductVariant', id: number, name: string }>, price: { __typename: 'Money', fractional: number, currency_code: string }, price_per_item: { __typename: 'Money', fractional: number, currency_code: string } }> };

export const CouponApplicationFieldsFragmentDoc = gql`
    fragment CouponApplicationFields on CouponApplication {
  id
  discount {
    fractional
    currency_code
  }
  coupon {
    id
    ...CouponFields
  }
}
    ${CouponFieldsFragmentDoc}`;
export const AdminOrderFieldsFragmentDoc = gql`
    fragment AdminOrderFieldsFragment on Order {
  id
  status
  submitted_at
  charge_id
  payment_note
  user_con_profile {
    id
    name_without_nickname
  }
  total_price {
    fractional
    currency_code
  }
  payment_amount {
    fractional
    currency_code
  }
  coupon_applications {
    id
    ...CouponApplicationFields
  }
  order_entries {
    id
    quantity
    describe_products
    product {
      id
      name
    }
    product_variant {
      id
      name
    }
    price_per_item {
      fractional
      currency_code
    }
  }
}
    ${CouponApplicationFieldsFragmentDoc}`;
export const OrderEntryFieldsFragmentDoc = gql`
    fragment OrderEntryFields on OrderEntry {
  id
  quantity
  product {
    id
    name
    payment_options
    provides_ticket_type {
      id
    }
  }
  product_variant {
    id
    name
  }
  price {
    fractional
    currency_code
  }
  price_per_item {
    fractional
    currency_code
  }
}
    `;
export const CartOrderFieldsFragmentDoc = gql`
    fragment CartOrderFields on Order {
  id
  coupon_applications {
    id
    ...CouponApplicationFields
  }
  total_price_before_discounts {
    fractional
    currency_code
  }
  total_price {
    fractional
    currency_code
  }
  order_entries {
    id
    ...OrderEntryFields
  }
}
    ${CouponApplicationFieldsFragmentDoc}
${OrderEntryFieldsFragmentDoc}`;