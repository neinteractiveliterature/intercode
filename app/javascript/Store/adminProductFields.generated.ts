/* eslint-disable */
import * as Types from '../graphqlTypes.generated';

import { gql } from '@apollo/client';
import { PricingStructureFieldsFragmentDoc } from './pricingStructureFields.generated';
export type AdminProductFieldsFragment = { __typename: 'Product', id: string, name: string, description?: string | null, description_html?: string | null, available: boolean, payment_options: Array<string>, clickwrap_agreement?: string | null, clickwrap_agreement_html?: string | null, image?: { __typename: 'ActiveStorageAttachment', id: string, url: string } | null, pricing_structure: { __typename: 'PricingStructure', pricing_strategy: Types.PricingStrategy, price?: { __typename: 'Money', fractional: number, currency_code: string } | null, value: { __typename: 'Money', fractional: number, currency_code: string } | { __typename: 'PayWhatYouWantValue', allowed_currency_codes?: Array<string> | null, maximum_amount?: { __typename: 'Money', currency_code: string, fractional: number } | null, minimum_amount?: { __typename: 'Money', currency_code: string, fractional: number } | null, suggested_amount?: { __typename: 'Money', currency_code: string, fractional: number } | null } | { __typename: 'ScheduledMoneyValue', timespans: Array<{ __typename: 'TimespanWithMoneyValue', start?: string | null, finish?: string | null, value: { __typename: 'Money', fractional: number, currency_code: string } }> } }, product_variants: Array<{ __typename: 'ProductVariant', id: string, name: string, description?: string | null, position?: number | null, image?: { __typename: 'ActiveStorageAttachment', id: string, url: string } | null, override_pricing_structure?: { __typename: 'PricingStructure', pricing_strategy: Types.PricingStrategy, price?: { __typename: 'Money', fractional: number, currency_code: string } | null, value: { __typename: 'Money', fractional: number, currency_code: string } | { __typename: 'PayWhatYouWantValue', allowed_currency_codes?: Array<string> | null, maximum_amount?: { __typename: 'Money', currency_code: string, fractional: number } | null, minimum_amount?: { __typename: 'Money', currency_code: string, fractional: number } | null, suggested_amount?: { __typename: 'Money', currency_code: string, fractional: number } | null } | { __typename: 'ScheduledMoneyValue', timespans: Array<{ __typename: 'TimespanWithMoneyValue', start?: string | null, finish?: string | null, value: { __typename: 'Money', fractional: number, currency_code: string } }> } } | null }>, provides_ticket_type?: { __typename: 'TicketType', id: string, description?: string | null } | null };

export const AdminProductFieldsFragmentDoc = gql`
    fragment AdminProductFields on Product {
  id
  name
  description
  description_html
  available
  payment_options
  clickwrap_agreement
  clickwrap_agreement_html
  image {
    id
    url
  }
  pricing_structure {
    ...PricingStructureFields
  }
  product_variants {
    id
    name
    description
    position
    image {
      id
      url
    }
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