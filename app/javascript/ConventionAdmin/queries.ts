import { gql } from '@apollo/client';

export const ConventionAdminConventionFields = gql`
  fragment ConventionAdminConventionFields on Convention {
    id: transitionalId
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

    defaultLayout {
      id: transitionalId
      name
    }

    cmsLayouts {
      id: transitionalId
      name
    }

    rootPage {
      id: transitionalId
      name
    }

    cmsPages {
      id: transitionalId
      name
    }

    staff_positions {
      id: transitionalId
      name
    }

    catch_all_staff_position {
      id: transitionalId
      name
    }
  }
`;

export const ConventionAdminConventionQuery = gql`
  query ConventionAdminConventionQuery {
    convention: conventionByRequestHost {
      id: transitionalId
      ...ConventionAdminConventionFields
    }

    rootSite {
      id: transitionalId
      url
    }
  }

  ${ConventionAdminConventionFields}
`;

export const StripeAccountOnboardingLinkQuery = gql`
  query StripeAccountOnboardingLinkQuery($baseUrl: String!) {
    convention: conventionByRequestHost {
      id: transitionalId

      stripe_account {
        id
        account_onboarding_link(base_url: $baseUrl)
      }
    }
  }
`;
