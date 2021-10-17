import { gql } from '@apollo/client';

export const CouponFields = gql`
  fragment CouponFields on Coupon {
    id: transitionalId
    code
    fixed_amount {
      fractional
      currency_code
    }
    percent_discount
    provides_product {
      id: transitionalId
      name
    }
  }
`;
