import { gql } from '@apollo/client';
import { TeamMemberFields, TeamMemberFieldsWithoutPersonalInfo, TeamMemberTicketFields } from './queries';

export const CreateTeamMember = gql`
  mutation CreateTeamMember($input: CreateTeamMemberInput!) {
    createTeamMember(input: $input) {
      team_member {
        id: transitionalId
        ...TeamMemberFields
      }
    }
  }

  ${TeamMemberFields}
`;

export const DeleteTeamMember = gql`
  mutation DeleteTeamMember($input: DeleteTeamMemberInput!) {
    deleteTeamMember(input: $input) {
      team_member {
        id: transitionalId
        ...TeamMemberFieldsWithoutPersonalInfo
      }
    }
  }

  ${TeamMemberFieldsWithoutPersonalInfo}
`;

export const UpdateTeamMember = gql`
  mutation UpdateTeamMember($input: UpdateTeamMemberInput!) {
    updateTeamMember(input: $input) {
      team_member {
        id: transitionalId
        ...TeamMemberFieldsWithoutPersonalInfo
      }
    }
  }

  ${TeamMemberFieldsWithoutPersonalInfo}
`;

export const ProvideEventTicket = gql`
  mutation ProvideEventTicket($eventId: ID!, $userConProfileId: ID!, $ticketTypeId: ID!) {
    provideEventTicket(
      input: {
        transitionalEventId: $eventId
        transitionalUserConProfileId: $userConProfileId
        transitionalTicketTypeId: $ticketTypeId
      }
    ) {
      ticket {
        id: transitionalId
        ...TeamMemberTicketFields
      }
    }
  }

  ${TeamMemberTicketFields}
`;
