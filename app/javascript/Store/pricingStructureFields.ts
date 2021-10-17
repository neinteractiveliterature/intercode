import { gql } from '@apollo/client';

export const PricingStructureFields = gql`
  fragment PricingStructureFields on PricingStructure {
    pricing_strategy

    price {
      fractional
      currency_code
    }

    value {
      # eslint-disable-next-line @graphql-eslint/naming-convention
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
