import { gql } from '@apollo/client';
import { PricingStructureFields } from '../Store/pricingStructureFields';

export const TicketPurchaseFormQuery = gql`
  query TicketPurchaseFormQuery {
    convention: conventionByRequestHost {
      id: transitionalId
      name
      ticket_name

      products(only_ticket_providing: true, only_available: true) {
        id: transitionalId
        name
        description_html

        pricing_structure {
          ...PricingStructureFields
        }
      }

      ticket_types {
        id: transitionalId
        description

        providing_products {
          id: transitionalId
        }
      }

      my_profile {
        id: transitionalId
        name_without_nickname

        ticket {
          id: transitionalId
        }
      }
    }
  }

  ${PricingStructureFields}
`;

export const MyTicketDisplayQuery = gql`
  query MyTicketDisplayQuery {
    convention: conventionByRequestHost {
      id: transitionalId
      name
      ticket_name
      timezone_name

      my_profile {
        id: transitionalId
        name_without_nickname

        ticket {
          id: transitionalId
          created_at
          updated_at

          order_entry {
            id: transitionalId

            order {
              id: transitionalId
              charge_id
            }

            price_per_item {
              fractional
              currency_code
            }
          }

          ticket_type {
            id: transitionalId
            description
          }

          provided_by_event {
            id: transitionalId
            title
          }
        }
      }
    }
  }
`;
