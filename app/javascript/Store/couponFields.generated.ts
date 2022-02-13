/* eslint-disable */
import * as Types from '../graphqlTypes.generated';

import { gql } from '@apollo/client';
export type CouponFieldsFragment = { __typename: 'Coupon', id: string, code: string, percent_discount?: string | null, fixed_amount?: { __typename: 'Money', fractional: number, currency_code: string } | null, provides_product?: { __typename: 'Product', id: string, name: string } | null };

export const CouponFieldsFragmentDoc = gql`
    fragment CouponFields on Coupon {
  id
  code
  fixed_amount {
    fractional
    currency_code
  }
  percent_discount
  provides_product {
    id
    name
  }
}
    `;