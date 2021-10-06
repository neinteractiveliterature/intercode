import { gql } from '@apollo/client';
import { EventPageRunFields, RunCardRegistrationPolicyFields } from '../EventsApp/EventPage/queries';

export const SignupModerationRunFields = gql`
  fragment SignupModerationRunFields on Run {
    id: transitionalId
    title_suffix
    starts_at
    signup_count_by_state_and_bucket_key_and_counted

    event {
      id: transitionalId
      title
      length_seconds
    }
  }
`;

export const SignupModerationSignupRequestFields = gql`
  fragment SignupModerationSignupRequestFields on SignupRequest {
    id: transitionalId
    state
    requested_bucket_key
    created_at

    user_con_profile {
      id: transitionalId
      name
      name_inverted
      gravatar_enabled
      gravatar_url
    }

    replace_signup {
      id: transitionalId

      run {
        id: transitionalId
        ...SignupModerationRunFields
      }
    }

    target_run {
      id: transitionalId
      ...SignupModerationRunFields

      event {
        id: transitionalId
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
      id: transitionalId
      state
      waitlist_position
    }
  }

  ${SignupModerationRunFields}
`;

export const CreateSignupEventsQuery = gql`
  query CreateSignupEventsQuery($title: String) {
    convention: conventionByRequestHost {
      id: transitionalId
      events_paginated(filters: { title: $title }, per_page: 50) {
        entries {
          id: transitionalId
          title
          length_seconds
          private_signup_list

          runs {
            id: transitionalId
            starts_at
            title_suffix

            rooms {
              id: transitionalId
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
      id: transitionalId

      event(transitionalId: $eventId) {
        id: transitionalId
        title
        length_seconds
        private_signup_list
        can_play_concurrently

        registration_policy {
          ...RunCardRegistrationPolicyFields
        }

        team_members {
          id: transitionalId
          display_team_member
          user_con_profile {
            id: transitionalId
            gravatar_url
            gravatar_enabled
            name_without_nickname
          }
        }

        event_category {
          id: transitionalId
          team_member_name
        }

        runs {
          id: transitionalId
          ...EventPageRunFields
        }
      }

      user_con_profile(transitionalId: $userConProfileId) {
        id: transitionalId
        name_without_nickname

        signups {
          id: transitionalId
          state
          waitlist_position

          run {
            id: transitionalId
          }
        }

        signup_requests {
          id: transitionalId
          state

          target_run {
            id: transitionalId
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
      id: transitionalId

      signup_requests_paginated(
        sort: [{ field: "state", desc: false }, { field: "created_at", desc: false }]
        page: $page
        per_page: $perPage
      ) {
        total_pages

        entries {
          id: transitionalId
          ...SignupModerationSignupRequestFields
        }
      }
    }
  }

  ${SignupModerationSignupRequestFields}
`;
