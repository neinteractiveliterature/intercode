import { gql } from '@apollo/client';

export const ConventionAdminConventionFields = gql`
  fragment ConventionAdminConventionFields on Convention {
    id
    accepting_proposals
    starts_at
    ends_at
    canceled
    name
    domain
    email_from
    email_mode
    event_mailing_list_domain
    location
    language
    timezone_name
    timezone_mode
    show_schedule
    show_event_list
    hidden
    maximum_tickets
    ticket_name
    stripe_publishable_key
    masked_stripe_secret_key
    clickwrap_agreement
    ticket_mode
    site_mode
    signup_mode
    signup_requests_open

    maximum_event_signups {
      timespans {
        start
        finish
        value
      }
    }

    default_layout {
      id
      name
    }

    cms_layouts {
      id
      name
    }

    root_page {
      id
      name
    }

    pages {
      id
      name
    }

    staff_positions {
      id
      name
    }

    catch_all_staff_position {
      id
      name
    }
  }
`;

export const ConventionAdminConventionQuery = gql`
  query ConventionAdminConventionQuery {
    convention {
      id
      ...ConventionAdminConventionFields
    }

    rootSite {
      id
      url
    }
  }

  ${ConventionAdminConventionFields}
`;
