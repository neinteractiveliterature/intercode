import { gql } from '@apollo/client';
import { PricingStructureFields } from '../Store/pricingStructureFields';

export const TicketPurchaseFormQuery = gql`
  query TicketPurchaseFormQuery {
    convention: assertConvention {
      id
      name
      ticket_name

      products(only_ticket_providing: true, only_available: true) {
        id
        name
        description_html

        pricing_structure {
          ...PricingStructureFields
        }
      }

      ticket_types {
        id
        description

        providing_products {
          id
        }
      }
    }

    myProfile {
      id
      name_without_nickname

      ticket {
        id
      }
    }
  }

  ${PricingStructureFields}
`;

export const MyTicketDisplayQuery = gql`
  query MyTicketDisplayQuery {
    convention: assertConvention {
      id
      name
      ticket_name
      timezone_name
    }

    myProfile {
      id
      name_without_nickname

      ticket {
        id
        created_at
        updated_at

        order_entry {
          id

          order {
            id
            charge_id
          }

          price_per_item {
            fractional
            currency_code
          }
        }

        ticket_type {
          id
          description
        }

        provided_by_event {
          id
          title
        }
      }
    }
  }
`;
