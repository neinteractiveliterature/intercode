import { gql } from '@apollo/client';
import { PricingStructureFields } from './pricingStructureFields';

export const AdminProductFields = gql`
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

  ${PricingStructureFields}
`;
