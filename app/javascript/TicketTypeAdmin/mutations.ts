import { gql } from '@apollo/client';
import { TicketTypeAdmin_TicketTypeFields } from './queries';

export const CreateTicketType = gql`
  mutation CreateTicketType($input: CreateTicketTypeInput!) {
    createTicketType(input: $input) {
      ticket_type {
        id: transitionalId
        ...TicketTypeAdmin_TicketTypeFields
      }
    }
  }

  ${TicketTypeAdmin_TicketTypeFields}
`;

export const UpdateTicketType = gql`
  mutation UpdateTicketType($input: UpdateTicketTypeInput!) {
    updateTicketType(input: $input) {
      ticket_type {
        id: transitionalId
        ...TicketTypeAdmin_TicketTypeFields
      }
    }
  }

  ${TicketTypeAdmin_TicketTypeFields}
`;

export const DeleteTicketType = gql`
  mutation DeleteTicketType($input: DeleteTicketTypeInput!) {
    deleteTicketType(input: $input) {
      ticket_type {
        id: transitionalId
      }
    }
  }
`;
