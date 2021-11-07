import { gql } from '@apollo/client';

export const EventCategoryFields = gql`
  fragment EventCategoryFields on EventCategory {
    id
    name
    team_member_name
    proposal_description
    scheduling_ui
    default_color
    signed_up_color
    full_color
    can_provide_tickets

    events_paginated {
      total_entries
    }

    department {
      id
      name
    }

    event_form {
      id
      title
      form_type
    }

    event_proposal_form {
      id
      title
      form_type
    }
  }
`;

export const EventCategoryAdminQuery = gql`
  query EventCategoryAdminQuery {
    convention: conventionByRequestHost {
      id
      name
      ticket_name
      ticket_mode

      departments {
        id
        name
      }

      event_categories {
        id
        ...EventCategoryFields
      }

      forms {
        id
        title
        form_type
      }
    }
  }

  ${EventCategoryFields}
`;
