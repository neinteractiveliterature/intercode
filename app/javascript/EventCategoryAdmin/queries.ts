import { gql } from '@apollo/client';

export const EventCategoryFields = gql`
  fragment EventCategoryFields on EventCategory {
    id: transitionalId
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
      id: transitionalId
      name
    }

    event_form {
      id: transitionalId
      title
      form_type
    }

    event_proposal_form {
      id: transitionalId
      title
      form_type
    }
  }
`;

export const EventCategoryAdminQuery = gql`
  query EventCategoryAdminQuery {
    convention: conventionByRequestHost {
      id: transitionalId
      name
      ticket_name
      ticket_mode

      departments {
        id: transitionalId
        name
      }

      event_categories {
        id: transitionalId
        ...EventCategoryFields
      }

      forms {
        id: transitionalId
        title
        form_type
      }
    }
  }

  ${EventCategoryFields}
`;
