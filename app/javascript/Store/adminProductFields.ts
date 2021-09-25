import { gql } from '@apollo/client';
import { PricingStructureFields } from './pricingStructureFields';

export const AdminProductFields = gql`
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

  ${PricingStructureFields}
`;
