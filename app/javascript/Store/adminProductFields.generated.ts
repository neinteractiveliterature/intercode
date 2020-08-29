/* eslint-disable */
import * as Types from '../graphqlTypes.generated';

import { PricingStructureFieldsFragment } from './pricingStructureFields.generated';
import { gql } from '@apollo/client';
import { PricingStructureFieldsFragmentDoc } from './pricingStructureFields.generated';
export type AdminProductFieldsFragment = (
  { __typename?: 'Product' }
  & Pick<Types.Product, 'id' | 'name' | 'description' | 'description_html' | 'image_url' | 'available' | 'payment_options'>
  & { pricing_structure?: Types.Maybe<(
    { __typename?: 'PricingStructure' }
    & PricingStructureFieldsFragment
  )>, product_variants: Array<(
    { __typename?: 'ProductVariant' }
    & Pick<Types.ProductVariant, 'id' | 'name' | 'description' | 'image_url' | 'position'>
    & { override_pricing_structure?: Types.Maybe<(
      { __typename?: 'PricingStructure' }
      & PricingStructureFieldsFragment
    )> }
  )>, provides_ticket_type?: Types.Maybe<(
    { __typename?: 'TicketType' }
    & Pick<Types.TicketType, 'id' | 'description'>
  )> }
);

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