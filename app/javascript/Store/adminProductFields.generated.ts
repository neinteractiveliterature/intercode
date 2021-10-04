/* eslint-disable */
import * as Types from '../graphqlTypes.generated';

import { gql } from '@apollo/client';
import { PricingStructureFieldsFragmentDoc } from './pricingStructureFields.generated';
export type AdminProductFieldsFragment = { __typename: 'Product', name: string, description?: string | null | undefined, description_html?: string | null | undefined, image_url?: string | null | undefined, available: boolean, payment_options: Array<string>, id: string, pricing_structure: { __typename: 'PricingStructure', pricing_strategy: Types.PricingStrategy, price?: { __typename: 'Money', fractional: number, currency_code: string } | null | undefined, value: { __typename: 'Money', fractional: number, currency_code: string } | { __typename: 'ScheduledMoneyValue', timespans: Array<{ __typename: 'TimespanWithMoneyValue', start?: any | null | undefined, finish?: any | null | undefined, value: { __typename: 'Money', fractional: number, currency_code: string } }> } }, product_variants: Array<{ __typename: 'ProductVariant', name: string, description?: string | null | undefined, image_url?: string | null | undefined, position?: number | null | undefined, id: string, override_pricing_structure?: { __typename: 'PricingStructure', pricing_strategy: Types.PricingStrategy, price?: { __typename: 'Money', fractional: number, currency_code: string } | null | undefined, value: { __typename: 'Money', fractional: number, currency_code: string } | { __typename: 'ScheduledMoneyValue', timespans: Array<{ __typename: 'TimespanWithMoneyValue', start?: any | null | undefined, finish?: any | null | undefined, value: { __typename: 'Money', fractional: number, currency_code: string } }> } } | null | undefined }>, provides_ticket_type?: { __typename: 'TicketType', description?: string | null | undefined, id: string } | null | undefined };

export const AdminProductFieldsFragmentDoc = gql`
    fragment AdminProductFields on Product {
  id: transitionalId
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
    id: transitionalId
    name
    description
    image_url
    position
    override_pricing_structure {
      ...PricingStructureFields
    }
  }
  provides_ticket_type {
    id: transitionalId
    description
  }
}
    ${PricingStructureFieldsFragmentDoc}`;