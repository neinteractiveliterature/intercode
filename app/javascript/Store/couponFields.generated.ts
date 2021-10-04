/* eslint-disable */
import * as Types from '../graphqlTypes.generated';

import { gql } from '@apollo/client';
export type CouponFieldsFragment = { __typename: 'Coupon', code: string, percent_discount?: any | null | undefined, id: string, fixed_amount?: { __typename: 'Money', fractional: number, currency_code: string } | null | undefined, provides_product?: { __typename: 'Product', name: string, id: string } | null | undefined };

export const CouponFieldsFragmentDoc = gql`
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