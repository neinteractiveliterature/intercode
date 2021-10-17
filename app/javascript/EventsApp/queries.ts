import { gql } from '@apollo/client';

export const CommonConventionData = gql`
  fragment CommonConventionData on Convention {
    id: transitionalId
    name
    starts_at
    ends_at
    site_mode
    timezone_name
    timezone_mode
    ticket_name
    ticket_mode

    event_categories {
      id: transitionalId
      name
      scheduling_ui
      default_color
      full_color
      signed_up_color
    }
  }
`;

export const RunBasicSignupData = gql`
  fragment RunBasicSignupData on Run {
    id: transitionalId
    signup_count_by_state_and_bucket_key_and_counted

    my_signups {
      id: transitionalId
      state
    }

    my_signup_requests {
      id: transitionalId
      state
    }
  }
`;

export const CommonConventionDataQuery = gql`
  query CommonConventionDataQuery {
    convention: conventionByRequestHost {
      id: transitionalId
      ...CommonConventionData
    }
  }

  ${CommonConventionData}
`;
