import { gql } from '@apollo/client';

import { UserConProfileFields, UserConProfileAdminTicketFields } from './queries';

export const CreateUserConProfile = gql`
  mutation CreateUserConProfile($user_id: ID!, $user_con_profile: UserConProfileInput!) {
    createUserConProfile(input: { transitionalUserId: $user_id, user_con_profile: $user_con_profile }) {
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
    deleteUserConProfile(input: { transitionalId: $userConProfileId }) {
      user_con_profile {
        id
      }
    }
  }
`;

export const CreateTicket = gql`
  mutation CreateTicket($userConProfileId: ID!, $ticket: TicketInput!) {
    createTicket(input: { transitionalUserConProfileId: $userConProfileId, ticket: $ticket }) {
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
    updateTicket(input: { transitionalId: $id, ticket: $ticket }) {
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
    deleteTicket(input: { transitionalId: $ticketId, refund: $refund }) {
      ticket {
        id
      }
    }
  }
`;

export const ConvertTicketToEventProvided = gql`
  mutation ConvertTicketToEventProvided($eventId: ID!, $ticketTypeId: ID!, $userConProfileId: ID!) {
    convertTicketToEventProvided(
      input: {
        transitionalEventId: $eventId
        transitionalTicketTypeId: $ticketTypeId
        transitionalUserConProfileId: $userConProfileId
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
