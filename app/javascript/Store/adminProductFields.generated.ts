/* eslint-disable */
import * as Types from '../graphqlTypes.generated';

import { gql } from '@apollo/client';
import { PricingStructureFieldsFragmentDoc } from './pricingStructureFields.generated';
export type AdminProductFieldsFragment = { __typename: 'Product', id: number, name: string, description?: Types.Maybe<string>, description_html?: Types.Maybe<string>, image_url?: Types.Maybe<string>, available: boolean, payment_options: Array<string>, pricing_structure: { __typename: 'PricingStructure', pricing_strategy: Types.PricingStrategy, price?: Types.Maybe<{ __typename: 'Money', fractional: number, currency_code: string }>, value: { __typename: 'Money', fractional: number, currency_code: string } | { __typename: 'ScheduledMoneyValue', timespans: Array<{ __typename: 'TimespanWithMoneyValue', start?: Types.Maybe<any>, finish?: Types.Maybe<any>, value: { __typename: 'Money', fractional: number, currency_code: string } }> } }, product_variants: Array<{ __typename: 'ProductVariant', id: number, name: string, description?: Types.Maybe<string>, image_url?: Types.Maybe<string>, position?: Types.Maybe<number>, override_pricing_structure?: Types.Maybe<{ __typename: 'PricingStructure', pricing_strategy: Types.PricingStrategy, price?: Types.Maybe<{ __typename: 'Money', fractional: number, currency_code: string }>, value: { __typename: 'Money', fractional: number, currency_code: string } | { __typename: 'ScheduledMoneyValue', timespans: Array<{ __typename: 'TimespanWithMoneyValue', start?: Types.Maybe<any>, finish?: Types.Maybe<any>, value: { __typename: 'Money', fractional: number, currency_code: string } }> } }> }>, provides_ticket_type?: Types.Maybe<{ __typename: 'TicketType', id: number, description?: Types.Maybe<string> }> };

export const AdminProductFieldsFragmentDoc = gql`
    fragment AdminProductFields on Product {
  id
  name
  description
  description_html
  image_url
  available
  payment_options
  pricing_structure {
    ...PricingStructureFields
  }
  product_variants {
    id
    name
    description
    image_url
    position
    override_pricing_structure {
      ...PricingStructureFields
    }
  }
  provides_ticket_type {
    id
    description
  }
}
    ${PricingStructureFieldsFragmentDoc}`;