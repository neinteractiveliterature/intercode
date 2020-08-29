/* eslint-disable */
import * as Types from '../graphqlTypes.generated';

import { gql } from '@apollo/client';
export type PricingStructureFieldsFragment = (
  { __typename?: 'PricingStructure' }
  & Pick<Types.PricingStructure, 'pricing_strategy'>
  & { price?: Types.Maybe<(
    { __typename?: 'Money' }
    & Pick<Types.Money, 'fractional' | 'currency_code'>
  )>, value: (
    { __typename: 'Money' }
    & Pick<Types.Money, 'fractional' | 'currency_code'>
  ) | (
    { __typename: 'ScheduledMoneyValue' }
    & { timespans: Array<(
      { __typename?: 'TimespanWithMoneyValue' }
      & Pick<Types.TimespanWithMoneyValue, 'start' | 'finish'>
      & { value: (
        { __typename?: 'Money' }
        & Pick<Types.Money, 'fractional' | 'currency_code'>
      ) }
    )> }
  ) }
);

export const PricingStructureFieldsFragmentDoc = gql`
    fragment PricingStructureFields on PricingStructure {
  pricing_strategy
  price {
    fractional
    currency_code
  }
  value {
    __typename
    ... on Money {
      fractional
      currency_code
    }
    ... on ScheduledMoneyValue {
      timespans {
        start
        finish
        value {
          fractional
          currency_code
        }
      }
    }
  }
}
    `;