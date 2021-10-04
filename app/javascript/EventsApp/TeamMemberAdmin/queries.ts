import { gql } from '@apollo/client';
import { CommonConventionData } from '../queries';

export const TeamMemberTicketFields = gql`
  fragment TeamMemberTicketFields on Ticket {
    id: transitionalId

    user_con_profile {
      id: transitionalId
    }

    ticket_type {
      id: transitionalId
      name
    }

    provided_by_event {
      id: transitionalId
      title
    }
  }
`;

export const TeamMemberUserConProfileFields = gql`
  fragment TeamMemberUserConProfileFields on UserConProfile {
    id: transitionalId
    name_without_nickname
    name_inverted
    email
    mobile_phone

    ticket {
      id: transitionalId
      ...TeamMemberTicketFields
    }
  }

  ${TeamMemberTicketFields}
`;

export const TeamMemberUserConProfileSearchFields = gql`
  fragment TeamMemberUserConProfileSearchFields on UserConProfile {
    id: transitionalId
    name_without_nickname
    name_inverted
    email

    ticket {
      id: transitionalId
      ...TeamMemberTicketFields
    }
  }

  ${TeamMemberTicketFields}
`;

export const TeamMemberFields = gql`
  fragment TeamMemberFields on TeamMember {
    id: transitionalId
    display_team_member
    show_email
    receive_con_email
    receive_signup_email

    user_con_profile {
      id: transitionalId
      ...TeamMemberUserConProfileFields
    }
  }

  ${TeamMemberUserConProfileFields}
`;

export const TeamMemberFieldsWithoutPersonalInfo = gql`
  fragment TeamMemberFieldsWithoutPersonalInfo on TeamMember {
    id: transitionalId
    display_team_member
    show_email
    receive_con_email
    receive_signup_email

    user_con_profile {
      id: transitionalId
      ...TeamMemberUserConProfileSearchFields
    }
  }

  ${TeamMemberUserConProfileSearchFields}
`;

export const TeamMembersQuery = gql`
  query TeamMembersQuery($eventId: Int!) {
    convention: conventionByRequestHost {
      id: transitionalId
      ...CommonConventionData

      event(id: $eventId) {
        id: transitionalId
        title

        event_category {
          id: transitionalId
          can_provide_tickets
          team_member_name
        }

        provided_tickets {
          id: transitionalId
          ...TeamMemberTicketFields
        }

        team_members {
          id: transitionalId
          ...TeamMemberFields
        }
      }

      ticket_types {
        id: transitionalId
        name
        description
        maximum_event_provided_tickets(event_id: $eventId)
      }

      ticket_name
    }
  }

  ${CommonConventionData}
  ${TeamMemberTicketFields}
  ${TeamMemberFields}
`;

export const TeamMemberUserConProfilesQuery = gql`
  query TeamMemberUserConProfilesQuery($name: String) {
    convention: conventionByRequestHost {
      id: transitionalId
      user_con_profiles_paginated(filters: { name: $name }, per_page: 50) {
        entries {
          id: transitionalId
          ...TeamMemberUserConProfileSearchFields
        }
      }
    }
  }

  ${TeamMemberUserConProfileSearchFields}
`;
