import { gql } from '@apollo/client';
import { CouponFields } from './couponFields';

export const CouponApplicationFields = gql`
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

  ${CouponFields}
`;

export const AdminOrderFieldsFragment = gql`
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

  ${CouponApplicationFields}
`;

export const OrderEntryFields = gql`
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

export const CartOrderFields = gql`
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

  ${CouponApplicationFields}
  ${OrderEntryFields}
`;
