import { gql } from '@apollo/client';
import { EventPageRunFields, RunCardRegistrationPolicyFields } from '../EventsApp/EventPage/queries';

export const SignupModerationRunFields = gql`
  fragment SignupModerationRunFields on Run {
    id
    title_suffix
    starts_at
    signup_count_by_state_and_bucket_key_and_counted

    event {
      id
      title
      length_seconds
    }
  }
`;

export const SignupModerationSignupRequestFields = gql`
  fragment SignupModerationSignupRequestFields on SignupRequest {
    id
    state
    requested_bucket_key
    created_at

    user_con_profile {
      id
      name
      name_inverted
      gravatar_enabled
      gravatar_url
    }

    replace_signup {
      id

      run {
        id
        ...SignupModerationRunFields
      }
    }

    target_run {
      id
      ...SignupModerationRunFields

      event {
        id
        registration_policy {
          buckets {
            key
            name
            total_slots
            slots_limited
            anything
            not_counted
          }
          prevent_no_preference_signups
        }
      }
    }

    result_signup {
      id
      state
      waitlist_position
    }
  }

  ${SignupModerationRunFields}
`;

export const CreateSignupEventsQuery = gql`
  query CreateSignupEventsQuery($title: String) {
    convention: conventionByRequestHost {
      id
      events_paginated(filters: { title: $title }, per_page: 50) {
        entries {
          id
          title
          length_seconds
          private_signup_list

          runs {
            id
            starts_at
            title_suffix

            rooms {
              id
              name
            }
          }
        }
      }
    }
  }
`;

export const CreateSignupRunCardQuery = gql`
  query CreateSignupRunCardQuery($userConProfileId: ID!, $eventId: ID!) {
    currentAbility {
      can_read_schedule
      can_read_event_signups(transitionalEventId: $eventId)
      can_update_event(transitionalEventId: $eventId)
    }

    convention: conventionByRequestHost {
      id

      event(transitionalId: $eventId) {
        id
        title
        length_seconds
        private_signup_list
        can_play_concurrently

        registration_policy {
          ...RunCardRegistrationPolicyFields
        }

        team_members {
          id
          display_team_member
          user_con_profile {
            id
            gravatar_url
            gravatar_enabled
            name_without_nickname
          }
        }

        event_category {
          id
          team_member_name
        }

        runs {
          id
          ...EventPageRunFields
        }
      }

      user_con_profile(transitionalId: $userConProfileId) {
        id
        name_without_nickname

        signups {
          id
          state
          waitlist_position

          run {
            id
          }
        }

        signup_requests {
          id
          state

          target_run {
            id
          }
        }
      }
    }
  }

  ${RunCardRegistrationPolicyFields}
  ${EventPageRunFields}
`;

export const SignupModerationQueueQuery = gql`
  query SignupModerationQueueQuery($page: Int, $perPage: Int) {
    convention: conventionByRequestHost {
      id

      signup_requests_paginated(
        sort: [{ field: "state", desc: false }, { field: "created_at", desc: false }]
        page: $page
        per_page: $perPage
      ) {
        total_pages

        entries {
          id
          ...SignupModerationSignupRequestFields
        }
      }
    }
  }

  ${SignupModerationSignupRequestFields}
`;
