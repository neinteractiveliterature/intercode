import gql from 'graphql-tag';
import { CommonConventionData } from '../queries';

export const MySignupFields = gql`
fragment MySignupFields on Signup {
  id
  state
  waitlist_position
}
`;

export const MySignupRequestFields = gql`
fragment MySignupRequestFields on SignupRequest {
  id
  state
  target_run {
    id
  }
  requested_bucket_key
  replace_signup {
    id
  }
}
`;

export const EventPageRunFields = gql`
fragment EventPageRunFields on Run {
  id
  title_suffix
  starts_at
  current_ability_can_signup_summary_run
  signup_count_by_state_and_bucket_key_and_counted

  rooms {
    id
    name
  }

  my_signups {
    id
    ...MySignupFields
  }

  my_signup_requests {
    id
    ...MySignupRequestFields
  }
}

${MySignupFields}
${MySignupRequestFields}
`;

export const RunCardRegistrationPolicyFields = gql`
fragment RunCardRegistrationPolicyFields on RegistrationPolicy {
  slots_limited
  prevent_no_preference_signups
  total_slots_including_not_counted

  buckets {
    key
    name
    description
    not_counted
    slots_limited
    anything
    minimum_slots
    total_slots
  }
}
`;

export const EventPageEventFields = gql`
fragment EventPageEventFields on Event {
  id
  title
  length_seconds
  private_signup_list
  my_rating
  form_response_attrs_json_with_rendered_markdown
  can_play_concurrently

  event_category {
    id
    team_member_name
  }

  form {
    id
    form_api_json
  }

  team_members {
    id
    email
    display_team_member
    user_con_profile {
      id
      name_without_nickname
      gravatar_enabled
      gravatar_url
    }
  }

  registration_policy {
    ...RunCardRegistrationPolicyFields
  }

  runs {
    id
    ...EventPageRunFields
  }
}

${EventPageRunFields}
`;

export const EventPageQuery = gql`
query EventPageQuery($eventId: Int!) {
  __typename

  currentAbility {
    can_read_schedule
    can_update_event(event_id: $eventId)
    can_read_event_signups(event_id: $eventId)
  }

  convention {
    id
    ...CommonConventionData
  }

  myProfile {
    id
  }

  event(id: $eventId) {
    id
    ...EventPageEventFields
  }
}

${CommonConventionData}
${RunCardRegistrationPolicyFields}
${EventPageEventFields}
`;

export const CreateModeratedSignupModalQuery = gql`
query CreateModeratedSignupModalQuery {
  myProfile {
    id

    signups {
      id
      state

      run {
        id
        starts_at

        event {
          id
          title
          length_seconds
          can_play_concurrently
        }
      }
    }
  }
}
`;

export const EventHistoryQuery = gql`
query EventHistoryQuery($id: Int!) {
  convention {
    id
    starts_at
    ends_at
    timezone_name
  }

  event(id: $id) {
    id
    title

    event_category {
      id

      event_form {
        id
        form_api_json
      }
    }

    form_response_changes {
      user_con_profile {
        id
        name_without_nickname
      }

      field_identifier
      previous_value
      new_value
      created_at
      updated_at
    }
  }
}
`;
