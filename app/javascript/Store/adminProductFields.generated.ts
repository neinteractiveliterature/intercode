/* eslint-disable */
import * as Types from '../graphqlTypes.generated';

import { gql } from '@apollo/client';
import { PricingStructureFieldsFragmentDoc } from './pricingStructureFields.generated';
export type AdminProductFieldsFragment = { __typename: 'Product', id: string, name: string, description?: string | null | undefined, description_html?: string | null | undefined, available: boolean, payment_options: Array<string>, image?: { __typename: 'ActiveStorageAttachment', url: string } | null | undefined, pricing_structure: { __typename: 'PricingStructure', pricing_strategy: Types.PricingStrategy, price?: { __typename: 'Money', fractional: number, currency_code: string } | null | undefined, value: { __typename: 'Money', fractional: number, currency_code: string } | { __typename: 'ScheduledMoneyValue', timespans: Array<{ __typename: 'TimespanWithMoneyValue', start?: string | null | undefined, finish?: string | null | undefined, value: { __typename: 'Money', fractional: number, currency_code: string } }> } }, product_variants: Array<{ __typename: 'ProductVariant', id: string, name: string, description?: string | null | undefined, position?: number | null | undefined, image?: { __typename: 'ActiveStorageAttachment', id: string, url: string } | null | undefined, override_pricing_structure?: { __typename: 'PricingStructure', pricing_strategy: Types.PricingStrategy, price?: { __typename: 'Money', fractional: number, currency_code: string } | null | undefined, value: { __typename: 'Money', fractional: number, currency_code: string } | { __typename: 'ScheduledMoneyValue', timespans: Array<{ __typename: 'TimespanWithMoneyValue', start?: string | null | undefined, finish?: string | null | undefined, value: { __typename: 'Money', fractional: number, currency_code: string } }> } } | null | undefined }>, provides_ticket_type?: { __typename: 'TicketType', id: string, description?: string | null | undefined } | null | undefined };

export const AdminProductFieldsFragmentDoc = gql`
    fragment AdminProductFields on Product {
  id
  name
  description
  description_html
  available
  payment_options
  image {
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