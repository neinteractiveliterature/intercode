/* eslint-disable */
import * as Types from '../graphqlTypes.generated';

import { CouponFieldsFragment } from './couponFields.generated';
import { gql } from '@apollo/client';
import { CouponFieldsFragmentDoc } from './couponFields.generated';


export type CouponApplicationFieldsFragment = (
  { __typename?: 'CouponApplication' }
  & Pick<Types.CouponApplication, 'id'>
  & { discount: (
    { __typename?: 'Money' }
    & Pick<Types.Money, 'fractional' | 'currency_code'>
  ), coupon: (
    { __typename?: 'Coupon' }
    & Pick<Types.Coupon, 'id'>
    & CouponFieldsFragment
  ) }
);

export type AdminOrderFieldsFragmentFragment = (
  { __typename?: 'Order' }
  & Pick<Types.Order, 'id' | 'status' | 'submitted_at' | 'charge_id' | 'payment_note'>
  & { user_con_profile: (
    { __typename?: 'UserConProfile' }
    & Pick<Types.UserConProfile, 'id' | 'name_without_nickname'>
  ), total_price: (
    { __typename?: 'Money' }
    & Pick<Types.Money, 'fractional' | 'currency_code'>
  ), payment_amount?: Types.Maybe<(
    { __typename?: 'Money' }
    & Pick<Types.Money, 'fractional' | 'currency_code'>
  )>, coupon_applications: Array<(
    { __typename?: 'CouponApplication' }
    & Pick<Types.CouponApplication, 'id'>
    & CouponApplicationFieldsFragment
  )>, order_entries: Array<(
    { __typename?: 'OrderEntry' }
    & Pick<Types.OrderEntry, 'id' | 'quantity' | 'describe_products'>
    & { product: (
      { __typename?: 'Product' }
      & Pick<Types.Product, 'id' | 'name'>
    ), product_variant?: Types.Maybe<(
      { __typename?: 'ProductVariant' }
      & Pick<Types.ProductVariant, 'id' | 'name'>
    )>, price_per_item: (
      { __typename?: 'Money' }
      & Pick<Types.Money, 'fractional' | 'currency_code'>
    ) }
  )> }
);

export type OrderEntryFieldsFragment = (
  { __typename?: 'OrderEntry' }
  & Pick<Types.OrderEntry, 'id' | 'quantity'>
  & { product: (
    { __typename?: 'Product' }
    & Pick<Types.Product, 'id' | 'name' | 'payment_options'>
    & { provides_ticket_type?: Types.Maybe<(
      { __typename?: 'TicketType' }
      & Pick<Types.TicketType, 'id'>
    )> }
  ), product_variant?: Types.Maybe<(
    { __typename?: 'ProductVariant' }
    & Pick<Types.ProductVariant, 'id' | 'name'>
  )>, price: (
    { __typename?: 'Money' }
    & Pick<Types.Money, 'fractional' | 'currency_code'>
  ), price_per_item: (
    { __typename?: 'Money' }
    & Pick<Types.Money, 'fractional' | 'currency_code'>
  ) }
);

export type CartOrderFieldsFragment = (
  { __typename?: 'Order' }
  & Pick<Types.Order, 'id'>
  & { coupon_applications: Array<(
    { __typename?: 'CouponApplication' }
    & Pick<Types.CouponApplication, 'id'>
    & CouponApplicationFieldsFragment
  )>, total_price_before_discounts: (
    { __typename?: 'Money' }
    & Pick<Types.Money, 'fractional' | 'currency_code'>
  ), total_price: (
    { __typename?: 'Money' }
    & Pick<Types.Money, 'fractional' | 'currency_code'>
  ), order_entries: Array<(
    { __typename?: 'OrderEntry' }
    & Pick<Types.OrderEntry, 'id'>
    & OrderEntryFieldsFragment
  )> }
);

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
export const AdminOrderFieldsFragmentFragmentDoc = gql`
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