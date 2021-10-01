import { gql } from '@apollo/client';
import { CommonConventionData } from '../queries';

export const TeamMemberTicketFields = gql`
  fragment TeamMemberTicketFields on Ticket {
    id

    user_con_profile {
      id
    }

    ticket_type {
      id
      name
    }

    provided_by_event {
      id
      title
    }
  }
`;

export const TeamMemberUserConProfileFields = gql`
  fragment TeamMemberUserConProfileFields on UserConProfile {
    id
    name_without_nickname
    name_inverted
    email
    mobile_phone

    ticket {
      id
      ...TeamMemberTicketFields
    }
  }

  ${TeamMemberTicketFields}
`;

export const TeamMemberUserConProfileSearchFields = gql`
  fragment TeamMemberUserConProfileSearchFields on UserConProfile {
    id
    name_without_nickname
    name_inverted
    email

    ticket {
      id
      ...TeamMemberTicketFields
    }
  }

  ${TeamMemberTicketFields}
`;

export const TeamMemberFields = gql`
  fragment TeamMemberFields on TeamMember {
    id
    display_team_member
    show_email
    receive_con_email
    receive_signup_email

    user_con_profile {
      id
      ...TeamMemberUserConProfileFields
    }
  }

  ${TeamMemberUserConProfileFields}
`;

export const TeamMemberFieldsWithoutPersonalInfo = gql`
  fragment TeamMemberFieldsWithoutPersonalInfo on TeamMember {
    id
    display_team_member
    show_email
    receive_con_email
    receive_signup_email

    user_con_profile {
      id
      ...TeamMemberUserConProfileSearchFields
    }
  }

  ${TeamMemberUserConProfileSearchFields}
`;

export const TeamMembersQuery = gql`
  query TeamMembersQuery($eventId: Int!) {
    convention: conventionByRequestHost {
      id
      ...CommonConventionData

      event(id: $eventId) {
        id
        title

        event_category {
          id
          can_provide_tickets
          team_member_name
        }

        provided_tickets {
          id
          ...TeamMemberTicketFields
        }

        team_members {
          id
          ...TeamMemberFields
        }
      }

      ticket_types {
        id
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
      id
      user_con_profiles_paginated(filters: { name: $name }, per_page: 50) {
        entries {
          id
          ...TeamMemberUserConProfileSearchFields
        }
      }
    }
  }

  ${TeamMemberUserConProfileSearchFields}
`;
