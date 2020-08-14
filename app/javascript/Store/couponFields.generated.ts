/* eslint-disable */
import * as Types from '../graphqlTypes.generated';

import { gql } from '@apollo/client';


export type CouponFieldsFragment = (
  { __typename?: 'Coupon' }
  & Pick<Types.Coupon, 'id' | 'code' | 'percent_discount'>
  & { fixed_amount?: Types.Maybe<(
    { __typename?: 'Money' }
    & Pick<Types.Money, 'fractional' | 'currency_code'>
  )>, provides_product?: Types.Maybe<(
    { __typename?: 'Product' }
    & Pick<Types.Product, 'id' | 'name'>
  )> }
);

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