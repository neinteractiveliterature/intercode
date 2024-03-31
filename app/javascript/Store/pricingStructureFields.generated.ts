/* eslint-disable */
import * as Types from '../graphqlTypes.generated';

import { gql } from '@apollo/client';
export type PricingStructureFieldsFragment = { __typename: 'PricingStructure', pricing_strategy: Types.PricingStrategy, price?: { __typename: 'Money', fractional: number, currency_code: string } | null, value: { __typename: 'Money', fractional: number, currency_code: string } | { __typename: 'PayWhatYouWantValue', allowed_currency_codes?: Array<string> | null, maximum_amount?: { __typename: 'Money', currency_code: string, fractional: number } | null, minimum_amount?: { __typename: 'Money', currency_code: string, fractional: number } | null, suggested_amount?: { __typename: 'Money', currency_code: string, fractional: number } | null } | { __typename: 'ScheduledMoneyValue', timespans: Array<{ __typename: 'TimespanWithMoneyValue', start?: string | null, finish?: string | null, value: { __typename: 'Money', fractional: number, currency_code: string } }> } };

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
    ... on PayWhatYouWantValue {
      maximum_amount {
        currency_code
        fractional
      }
      minimum_amount {
        currency_code
        fractional
      }
      suggested_amount {
        currency_code
        fractional
      }
      allowed_currency_codes
    }
  }
}
    `;