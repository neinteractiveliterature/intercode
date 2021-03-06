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
    clickwrap_agreement
    ticket_mode
    site_mode
    signup_mode
    signup_requests_open
    stripe_account_ready_to_charge

    stripe_account {
      id
      email
      charges_enabled
      display_name
    }

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
    convention: assertConvention {
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

export const StripeAccountOnboardingLinkQuery = gql`
  query StripeAccountOnboardingLinkQuery($baseUrl: String!) {
    convention: assertConvention {
      id

      stripe_account {
        id
        account_onboarding_link(base_url: $baseUrl)
      }
    }
  }
`;
