/* eslint-disable */
import * as Types from '../graphqlTypes.generated';

import { gql } from '@apollo/client';
export type CouponFieldsFragment = { __typename: 'Coupon', id: number, code: string, percent_discount?: any | null | undefined, fixed_amount?: { __typename: 'Money', fractional: number, currency_code: string } | null | undefined, provides_product?: { __typename: 'Product', id: number, name: string } | null | undefined };

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