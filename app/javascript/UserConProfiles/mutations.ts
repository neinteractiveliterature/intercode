import { gql } from '@apollo/client';

import { UserConProfileFields, UserConProfileAdminTicketFields } from './queries';

export const CreateUserConProfile = gql`
  mutation CreateUserConProfile($user_id: Int!, $user_con_profile: UserConProfileInput!) {
    createUserConProfile(input: { user_id: $user_id, user_con_profile: $user_con_profile }) {
      user_con_profile {
        id
      }
    }
  }
`;

export const UpdateUserConProfile = gql`
  mutation UpdateUserConProfile($input: UpdateUserConProfileInput!) {
    updateUserConProfile(input: $input) {
      user_con_profile {
        id
        ...UserConProfileFields
      }
    }
  }

  ${UserConProfileFields}
`;

export const DeleteUserConProfile = gql`
  mutation DeleteUserConProfile($userConProfileId: Int!) {
    deleteUserConProfile(input: { id: $userConProfileId }) {
      user_con_profile {
        id
      }
    }
  }
`;

export const CreateTicket = gql`
  mutation CreateTicket($userConProfileId: Int!, $ticket: TicketInput!) {
    createTicket(input: { user_con_profile_id: $userConProfileId, ticket: $ticket }) {
      ticket {
        id
        ...UserConProfileAdminTicketFields
      }
    }
  }

  ${UserConProfileAdminTicketFields}
`;

export const UpdateTicket = gql`
  mutation UpdateTicket($id: Int!, $ticket: TicketInput!) {
    updateTicket(input: { id: $id, ticket: $ticket }) {
      ticket {
        id
        ...UserConProfileAdminTicketFields
      }
    }
  }

  ${UserConProfileAdminTicketFields}
`;

export const DeleteTicket = gql`
  mutation DeleteTicket($ticketId: Int!, $refund: Boolean!) {
    deleteTicket(input: { id: $ticketId, refund: $refund }) {
      ticket {
        id
      }
    }
  }
`;

export const ConvertTicketToEventProvided = gql`
  mutation ConvertTicketToEventProvided(
    $eventId: Int!
    $ticketTypeId: Int!
    $userConProfileId: Int!
  ) {
    convertTicketToEventProvided(
      input: {
        event_id: $eventId
        ticket_type_id: $ticketTypeId
        user_con_profile_id: $userConProfileId
      }
    ) {
      ticket {
        id
        ...UserConProfileAdminTicketFields
      }
    }
  }

  ${UserConProfileAdminTicketFields}
`;
