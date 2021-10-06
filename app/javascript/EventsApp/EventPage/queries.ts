import { gql } from '@apollo/client';
import { CommonConventionData } from '../queries';
import { CommonFormFields } from '../../Models/commonFormFragments';

export const MySignupFields = gql`
  fragment MySignupFields on Signup {
    id: transitionalId
    state
    waitlist_position
  }
`;

export const MySignupRequestFields = gql`
  fragment MySignupRequestFields on SignupRequest {
    id: transitionalId
    state
    target_run {
      id: transitionalId
    }
    requested_bucket_key
    replace_signup {
      id: transitionalId
    }
  }
`;

export const EventPageRunFields = gql`
  fragment EventPageRunFields on Run {
    id: transitionalId
    title_suffix
    starts_at
    current_ability_can_signup_summary_run
    signup_count_by_state_and_bucket_key_and_counted

    rooms {
      id: transitionalId
      name
    }

    my_signups {
      id: transitionalId
      ...MySignupFields
    }

    my_signup_requests {
      id: transitionalId
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

export const EventPageQuery = gql`
  query EventPageQuery($eventId: ID!) {
    # eslint-disable-next-line @graphql-eslint/naming-convention
    __typename

    currentAbility {
      can_read_schedule
      can_update_event(transitionalEventId: $eventId)
      can_read_event_signups(transitionalEventId: $eventId)
    }

    convention: conventionByRequestHost {
      id: transitionalId
      ...CommonConventionData

      my_profile {
        id: transitionalId
      }

      event(transitionalId: $eventId) {
        id: transitionalId
        title
        length_seconds
        private_signup_list
        my_rating
        can_play_concurrently
        form_response_attrs_json_with_rendered_markdown

        event_category {
          id: transitionalId
          team_member_name
        }

        form {
          id: transitionalId
          ...CommonFormFields

          form_sections {
            id: transitionalId
            ...CommonFormSectionFields

            form_items {
              id: transitionalId
              public_description
              ...CommonFormItemFields
            }
          }
        }

        team_members {
          id: transitionalId
          email
          display_team_member
          user_con_profile {
            id: transitionalId
            name_without_nickname
            gravatar_enabled
            gravatar_url
          }
        }

        registration_policy {
          ...RunCardRegistrationPolicyFields
        }

        runs {
          id: transitionalId
          ...EventPageRunFields
        }
      }
    }
  }

  ${CommonConventionData}
  ${RunCardRegistrationPolicyFields}
  ${EventPageRunFields}
  ${CommonFormFields}
`;

export const CreateModeratedSignupModalQuery = gql`
  query CreateModeratedSignupModalQuery {
    convention: conventionByRequestHost {
      id: transitionalId

      my_profile {
        id: transitionalId

        signups {
          id: transitionalId
          state

          run {
            id: transitionalId
            starts_at

            event {
              id: transitionalId
              title
              length_seconds
              can_play_concurrently
            }
          }
        }
      }
    }
  }
`;
