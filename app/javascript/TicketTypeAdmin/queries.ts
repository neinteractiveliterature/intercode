import { gql } from '@apollo/client';
import { PricingStructureFields } from '../Store/pricingStructureFields';

// eslint-disable-next-line @typescript-eslint/naming-convention
export const TicketTypeAdmin_TicketTypeFields = gql`
  fragment TicketTypeAdmin_TicketTypeFields on TicketType {
    id
    name
    description
    counts_towards_convention_maximum
    allows_event_signups
    maximum_event_provided_tickets

    providing_products {
      id
      name
      available

      pricing_structure {
        ...PricingStructureFields
      }
    }
  }

  ${PricingStructureFields}
`;

export const AdminTicketTypesQuery = gql`
  query AdminTicketTypesQuery {
    convention: conventionByRequestHost {
      id
      ticket_types {
        id
        ...TicketTypeAdmin_TicketTypeFields
      }

      ticket_name
      timezone_name
    }
  }

  ${TicketTypeAdmin_TicketTypeFields}
`;
