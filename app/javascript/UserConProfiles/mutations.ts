import { gql } from '@apollo/client';

import { UserConProfileFields, UserConProfileAdminTicketFields } from './queries';

export const CreateUserConProfile = gql`
  mutation CreateUserConProfile($user_id: ID!, $user_con_profile: UserConProfileInput!) {
    createUserConProfile(input: { userId: $user_id, user_con_profile: $user_con_profile }) {
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
  mutation DeleteUserConProfile($userConProfileId: ID!) {
    deleteUserConProfile(input: { id: $userConProfileId }) {
      user_con_profile {
        id
      }
    }
  }
`;

export const CreateTicket = gql`
  mutation CreateTicket($userConProfileId: ID!, $ticket: TicketInput!) {
    createTicket(input: { userConProfileId: $userConProfileId, ticket: $ticket }) {
      ticket {
        id
        ...UserConProfileAdminTicketFields
      }
    }
  }

  ${UserConProfileAdminTicketFields}
`;

export const UpdateTicket = gql`
  mutation UpdateTicket($id: ID!, $ticket: TicketInput!) {
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
  mutation DeleteTicket($ticketId: ID!, $refund: Boolean!) {
    deleteTicket(input: { id: $ticketId, refund: $refund }) {
      ticket {
        id
      }
    }
  }
`;

export const ConvertTicketToEventProvided = gql`
  mutation ConvertTicketToEventProvided($eventId: ID!, $ticketTypeId: ID!, $userConProfileId: ID!) {
    convertTicketToEventProvided(
      input: { eventId: $eventId, ticketTypeId: $ticketTypeId, userConProfileId: $userConProfileId }
    ) {
      ticket {
        id
        ...UserConProfileAdminTicketFields
      }
    }
  }

  ${UserConProfileAdminTicketFields}
`;
