import { gql } from '@apollo/client';
import { CommonConventionData } from '../queries';

export const SignupFields = gql`
  fragment SignupFields on Signup {
    id
    state
    counted
    bucket_key
    requested_bucket_key

    run {
      id
      title_suffix
      starts_at
      ends_at

      rooms {
        id
        name
      }

      event {
        id
        title

        event_category {
          id
          team_member_name
        }

        registration_policy {
          buckets {
            key
            name
            anything
          }
        }

        team_members {
          id
          user_con_profile {
            id
          }
        }
      }
    }

    user_con_profile {
      id
      name_without_nickname
      nickname
      birth_date
      email
      address
      city
      state
      zipcode
      country
      mobile_phone
      gravatar_enabled
      gravatar_url
    }
  }
`;

export const UserConProfileSignupsFragment = gql`
  fragment UserConProfileSignupsFragment on UserConProfile {
    id
    signups {
      id
      state
      counted
      bucket_key
      requested_bucket_key

      user_con_profile {
        id
      }

      run {
        id
        starts_at

        event {
          id
          title
          length_seconds

          event_category {
            id
            team_member_name
          }

          registration_policy {
            buckets {
              key
              name
            }
          }

          team_members {
            id

            user_con_profile {
              id
            }
          }
        }

        rooms {
          id
          name
        }
      }
    }
  }
`;

export const SignupAdminEventQuery = gql`
  query SignupAdminEventQuery($eventId: Int!) {
    convention {
      id
      ...CommonConventionData
    }

    event(id: $eventId) {
      id
      title
    }
  }

  ${CommonConventionData}
`;

export const AdminSignupQuery = gql`
  query AdminSignupQuery($id: Int!) {
    convention {
      id
      ...CommonConventionData
    }

    currentAbility {
      can_update_bucket_signup(signup_id: $id)
      can_force_confirm_signup(signup_id: $id)
      can_update_counted_signup(signup_id: $id)
    }

    signup(id: $id) {
      id
      ...SignupFields
    }
  }

  ${CommonConventionData}
  ${SignupFields}
`;

export const RunSignupsTableSignupsQuery = gql`
  query RunSignupsTableSignupsQuery(
    $eventId: Int!
    $runId: Int!
    $page: Int
    $perPage: Int
    $filters: SignupFiltersInput
    $sort: [SortInput!]
  ) {
    convention {
      id
      name
    }

    event(id: $eventId) {
      id
      title

      event_category {
        id
        team_member_name
      }

      team_members {
        id

        user_con_profile {
          id
        }
      }

      registration_policy {
        buckets {
          key
          name
        }
      }

      run(id: $runId) {
        id

        signups_paginated(page: $page, per_page: $perPage, filters: $filters, sort: $sort) {
          total_entries
          total_pages
          current_page
          per_page

          entries {
            id
            state
            counted
            bucket_key
            requested_bucket_key
            age_restrictions_check

            run {
              id
              starts_at
            }

            user_con_profile {
              id
              name_inverted
              name_without_nickname
              gravatar_enabled
              gravatar_url
              email
              birth_date
            }
          }
        }
      }
    }
  }
`;

export const RunHeaderRunInfoQuery = gql`
  query RunHeaderRunInfoQuery($eventId: Int!, $runId: Int!) {
    convention {
      id
      ...CommonConventionData
    }

    event(id: $eventId) {
      id
      title
      length_seconds

      registration_policy {
        total_slots
        slots_limited

        buckets {
          name
          total_slots
        }
      }

      run(id: $runId) {
        id
        starts_at
        title_suffix
      }
    }
  }

  ${CommonConventionData}
`;

export const RunSignupSummaryQuery = gql`
  query RunSignupSummaryQuery($eventId: Int!, $runId: Int!) {
    convention {
      id
      ...CommonConventionData
    }

    currentAbility {
      can_read_schedule
    }

    event(id: $eventId) {
      id
      title

      event_category {
        id
        team_member_name
      }

      registration_policy {
        buckets {
          key
          name
          expose_attendees
        }
      }

      team_members {
        id
        user_con_profile {
          id
        }
      }

      runs {
        id
        starts_at
      }

      run(id: $runId) {
        id

        signups_paginated(per_page: 1000, filters: { state: ["confirmed", "waitlisted"] }) {
          entries {
            id
            state
            bucket_key
            waitlist_position

            user_con_profile {
              id
              name_inverted
              gravatar_enabled
              gravatar_url
            }
          }
        }
      }
    }
  }

  ${CommonConventionData}
`;

export const UserConProfileSignupsQuery = gql`
  query UserConProfileSignupsQuery($id: Int!) {
    convention {
      id
      ...CommonConventionData
    }

    myProfile {
      id
      ability {
        can_withdraw_all_user_con_profile_signups(user_con_profile_id: $id)
      }
    }

    userConProfile(id: $id) {
      id
      name_without_nickname
      ical_secret

      team_members {
        id

        event {
          id
          title
          status
        }
      }

      ...UserConProfileSignupsFragment
    }
  }

  ${CommonConventionData}
  ${UserConProfileSignupsFragment}
`;

export const RunSignupChangesQuery = gql`
  query RunSignupChangesQuery(
    $runId: Int!
    $filters: SignupChangeFiltersInput
    $sort: [SortInput!]
    $page: Int
    $perPage: Int
  ) {
    convention {
      id
      timezone_name
    }

    run(id: $runId) {
      id
      event {
        id
        title
      }

      signup_changes_paginated(page: $page, per_page: $perPage, filters: $filters, sort: $sort) {
        total_entries
        total_pages
        current_page
        per_page

        entries {
          id
          state
          counted
          bucket_key
          action
          created_at

          previous_signup_change {
            id
            state
            counted
            bucket_key
          }

          run {
            id

            event {
              id
              title

              event_category {
                id
                team_member_name
              }

              registration_policy {
                buckets {
                  key
                  name
                  anything
                }
              }

              team_members {
                id
                user_con_profile {
                  id
                }
              }
            }
          }

          user_con_profile {
            id
            name_inverted
            gravatar_enabled
            gravatar_url
          }
        }
      }
    }
  }
`;
