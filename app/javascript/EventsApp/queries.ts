import gql from 'graphql-tag';

export const CommonConventionData = gql`
fragment CommonConventionData on Convention {
  id
  name
  starts_at
  ends_at
  site_mode
  timezone_name
  timezone_mode
  ticket_name
  ticket_mode

  event_categories {
    id
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
  id
  signup_count_by_state_and_bucket_key_and_counted

  my_signups {
    id
    state
  }

  my_signup_requests {
    id
    state
  }
}
`;

export const CommonConventionDataQuery = gql`
query CommonConventionDataQuery {
  convention {
    id
    ...CommonConventionData
  }
}

${CommonConventionData}
`;
