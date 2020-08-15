import { gql } from '@apollo/client';
import { TeamMemberFieldsWithoutPersonalInfo, TeamMemberTicketFields } from './queries';

export const CreateTeamMember = gql`
  mutation CreateTeamMember($input: CreateTeamMemberInput!) {
    createTeamMember(input: $input) {
      clientMutationId
      # we're using refetchQueries to get the updated team member list here
    }
  }
`;

export const DeleteTeamMember = gql`
  mutation DeleteTeamMember($input: DeleteTeamMemberInput!) {
    deleteTeamMember(input: $input) {
      team_member {
        id
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
        id
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
        id
        ...TeamMemberTicketFields
      }
    }
  }

  ${TeamMemberTicketFields}
`;
