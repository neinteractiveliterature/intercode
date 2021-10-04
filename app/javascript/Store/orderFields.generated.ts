/* eslint-disable */
import * as Types from '../graphqlTypes.generated';

import { gql } from '@apollo/client';
import { CouponFieldsFragmentDoc } from './couponFields.generated';
export type CouponApplicationFieldsFragment = { __typename: 'CouponApplication', id: string, discount: { __typename: 'Money', fractional: number, currency_code: string }, coupon: { __typename: 'Coupon', code: string, percent_discount?: any | null | undefined, id: string, fixed_amount?: { __typename: 'Money', fractional: number, currency_code: string } | null | undefined, provides_product?: { __typename: 'Product', name: string, id: string } | null | undefined } };

export type AdminOrderFieldsFragment = { __typename: 'Order', status: Types.OrderStatus, submitted_at?: any | null | undefined, charge_id?: string | null | undefined, payment_note?: string | null | undefined, id: string, user_con_profile: { __typename: 'UserConProfile', name_without_nickname: string, id: string }, total_price: { __typename: 'Money', fractional: number, currency_code: string }, payment_amount?: { __typename: 'Money', fractional: number, currency_code: string } | null | undefined, coupon_applications: Array<{ __typename: 'CouponApplication', id: string, discount: { __typename: 'Money', fractional: number, currency_code: string }, coupon: { __typename: 'Coupon', code: string, percent_discount?: any | null | undefined, id: string, fixed_amount?: { __typename: 'Money', fractional: number, currency_code: string } | null | undefined, provides_product?: { __typename: 'Product', name: string, id: string } | null | undefined } }>, order_entries: Array<{ __typename: 'OrderEntry', quantity: number, describe_products: string, id: string, product: { __typename: 'Product', name: string, id: string }, product_variant?: { __typename: 'ProductVariant', name: string, id: string } | null | undefined, price_per_item: { __typename: 'Money', fractional: number, currency_code: string } }> };

export type OrderEntryFieldsFragment = { __typename: 'OrderEntry', quantity: number, id: string, product: { __typename: 'Product', name: string, payment_options: Array<string>, id: string, provides_ticket_type?: { __typename: 'TicketType', id: string } | null | undefined }, product_variant?: { __typename: 'ProductVariant', name: string, id: string } | null | undefined, price: { __typename: 'Money', fractional: number, currency_code: string }, price_per_item: { __typename: 'Money', fractional: number, currency_code: string } };

export type CartOrderFieldsFragment = { __typename: 'Order', id: string, coupon_applications: Array<{ __typename: 'CouponApplication', id: string, discount: { __typename: 'Money', fractional: number, currency_code: string }, coupon: { __typename: 'Coupon', code: string, percent_discount?: any | null | undefined, id: string, fixed_amount?: { __typename: 'Money', fractional: number, currency_code: string } | null | undefined, provides_product?: { __typename: 'Product', name: string, id: string } | null | undefined } }>, total_price_before_discounts: { __typename: 'Money', fractional: number, currency_code: string }, total_price: { __typename: 'Money', fractional: number, currency_code: string }, order_entries: Array<{ __typename: 'OrderEntry', quantity: number, id: string, product: { __typename: 'Product', name: string, payment_options: Array<string>, id: string, provides_ticket_type?: { __typename: 'TicketType', id: string } | null | undefined }, product_variant?: { __typename: 'ProductVariant', name: string, id: string } | null | undefined, price: { __typename: 'Money', fractional: number, currency_code: string }, price_per_item: { __typename: 'Money', fractional: number, currency_code: string } }> };

export const CouponApplicationFieldsFragmentDoc = gql`
    fragment CouponApplicationFields on CouponApplication {
  id: transitionalId
  discount {
    fractional
    currency_code
  }
  coupon {
    id: transitionalId
    ...CouponFields
  }
}
    ${CouponFieldsFragmentDoc}`;
export const AdminOrderFieldsFragmentDoc = gql`
    fragment AdminOrderFieldsFragment on Order {
  id: transitionalId
  status
  submitted_at
  charge_id
  payment_note
  user_con_profile {
    id: transitionalId
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
    id: transitionalId
    ...CouponApplicationFields
  }
  order_entries {
    id: transitionalId
    quantity
    describe_products
    product {
      id: transitionalId
      name
    }
    product_variant {
      id: transitionalId
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
  id: transitionalId
  quantity
  product {
    id: transitionalId
    name
    payment_options
    provides_ticket_type {
      id: transitionalId
    }
  }
  product_variant {
    id: transitionalId
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
  id: transitionalId
  coupon_applications {
    id: transitionalId
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
    id: transitionalId
    ...OrderEntryFields
  }
}
    ${CouponApplicationFieldsFragmentDoc}
${OrderEntryFieldsFragmentDoc}`;