/* eslint-disable */
import * as Types from '../graphqlTypes.generated';

import { gql } from '@apollo/client';
export type PricingStructureFieldsFragment = { __typename: 'PricingStructure', pricing_strategy: Types.PricingStrategy, price?: { __typename: 'Money', fractional: number, currency_code: string } | null | undefined, value: { __typename: 'Money', fractional: number, currency_code: string } | { __typename: 'ScheduledMoneyValue', timespans: Array<{ __typename: 'TimespanWithMoneyValue', start?: string | null | undefined, finish?: string | null | undefined, value: { __typename: 'Money', fractional: number, currency_code: string } }> } };

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