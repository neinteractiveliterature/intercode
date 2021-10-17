import { gql } from '@apollo/client';
import { CouponFields } from './couponFields';

export const CouponApplicationFields = gql`
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

  ${CouponFields}
`;

export const AdminOrderFieldsFragment = gql`
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

  ${CouponApplicationFields}
`;

export const OrderEntryFields = gql`
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

export const CartOrderFields = gql`
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

  ${CouponApplicationFields}
  ${OrderEntryFields}
`;
