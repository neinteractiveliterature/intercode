/* eslint-disable */
import * as Types from '../graphqlTypes.generated';

import { gql } from '@apollo/client';
export type CouponFieldsFragment = { __typename: 'Coupon', id: number, code: string, percent_discount?: Types.Maybe<any>, fixed_amount?: Types.Maybe<{ __typename: 'Money', fractional: number, currency_code: string }>, provides_product?: Types.Maybe<{ __typename: 'Product', id: number, name: string }> };

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