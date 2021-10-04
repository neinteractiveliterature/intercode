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
  mutation ProvideEventTicket($eventId: Int!, $userConProfileId: Int!, $ticketTypeId: Int!) {
    provideEventTicket(
      input: {
        event_id: $eventId
        user_con_profile_id: $userConProfileId
        ticket_type_id: $ticketTypeId
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
