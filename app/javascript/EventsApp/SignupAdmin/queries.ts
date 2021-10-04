import { gql } from '@apollo/client';
import { CommonConventionData } from '../queries';

export const SignupFields = gql`
  fragment SignupFields on Signup {
    id: transitionalId
    state
    counted
    bucket_key
    requested_bucket_key

    run {
      id: transitionalId
      title_suffix
      starts_at
      ends_at

      rooms {
        id: transitionalId
        name
      }

      event {
        id: transitionalId
        title

        event_category {
          id: transitionalId
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
          id: transitionalId
          user_con_profile {
            id: transitionalId
          }
        }
      }
    }

    user_con_profile {
      id: transitionalId
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
    id: transitionalId
    signups {
      id: transitionalId
      state
      counted
      bucket_key
      requested_bucket_key

      user_con_profile {
        id: transitionalId
      }

      run {
        id: transitionalId
        starts_at

        event {
          id: transitionalId
          title
          length_seconds

          event_category {
            id: transitionalId
            team_member_name
          }

          registration_policy {
            buckets {
              key
              name
            }
          }

          team_members {
            id: transitionalId

            user_con_profile {
              id: transitionalId
            }
          }
        }

        rooms {
          id: transitionalId
          name
        }
      }
    }
  }
`;

export const SignupAdminEventQuery = gql`
  query SignupAdminEventQuery($eventId: Int!) {
    convention: conventionByRequestHost {
      id: transitionalId
      ...CommonConventionData

      event(id: $eventId) {
        id: transitionalId
        title
      }
    }
  }

  ${CommonConventionData}
`;

export const AdminSignupQuery = gql`
  query AdminSignupQuery($id: Int!) {
    convention: conventionByRequestHost {
      id: transitionalId
      ...CommonConventionData

      signup(id: $id) {
        id: transitionalId
        ...SignupFields
      }
    }

    currentAbility {
      can_update_bucket_signup(signup_id: $id)
      can_force_confirm_signup(signup_id: $id)
      can_update_counted_signup(signup_id: $id)
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
    convention: conventionByRequestHost {
      id: transitionalId
      name

      event(id: $eventId) {
        id: transitionalId
        title

        event_category {
          id: transitionalId
          team_member_name
        }

        team_members {
          id: transitionalId

          user_con_profile {
            id: transitionalId
          }
        }

        registration_policy {
          buckets {
            key
            name
          }
        }

        run(id: $runId) {
          id: transitionalId

          signups_paginated(page: $page, per_page: $perPage, filters: $filters, sort: $sort) {
            total_entries
            total_pages
            current_page
            per_page

            entries {
              id: transitionalId
              state
              counted
              bucket_key
              requested_bucket_key
              age_restrictions_check

              run {
                id: transitionalId
                starts_at
              }

              user_con_profile {
                id: transitionalId
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
  }
`;

export const RunHeaderRunInfoQuery = gql`
  query RunHeaderRunInfoQuery($eventId: Int!, $runId: Int!) {
    convention: conventionByRequestHost {
      id: transitionalId
      ...CommonConventionData

      event(id: $eventId) {
        id: transitionalId
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
          id: transitionalId
          starts_at
          title_suffix
        }
      }
    }
  }

  ${CommonConventionData}
`;

export const RunSignupSummaryQuery = gql`
  query RunSignupSummaryQuery($eventId: Int!, $runId: Int!) {
    convention: conventionByRequestHost {
      id: transitionalId
      ...CommonConventionData

      event(id: $eventId) {
        id: transitionalId
        title

        event_category {
          id: transitionalId
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
          id: transitionalId
          user_con_profile {
            id: transitionalId
          }
        }

        runs {
          id: transitionalId
          starts_at
        }

        run(id: $runId) {
          id: transitionalId

          signups_paginated(per_page: 1000, filters: { state: ["confirmed", "waitlisted"] }) {
            entries {
              id: transitionalId
              state
              bucket_key
              waitlist_position

              user_con_profile {
                id: transitionalId
                name_inverted
                gravatar_enabled
                gravatar_url
              }
            }
          }
        }
      }
    }

    currentAbility {
      can_read_schedule
    }
  }

  ${CommonConventionData}
`;

export const UserConProfileSignupsQuery = gql`
  query UserConProfileSignupsQuery($id: Int!) {
    convention: conventionByRequestHost {
      id: transitionalId
      ...CommonConventionData

      my_profile {
        id: transitionalId
        ability {
          can_withdraw_all_user_con_profile_signups(user_con_profile_id: $id)
        }
      }

      user_con_profile(id: $id) {
        id: transitionalId
        name_without_nickname
        ical_secret

        team_members {
          id: transitionalId

          event {
            id: transitionalId
            title
            status
          }
        }

        ...UserConProfileSignupsFragment
      }
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
    convention: conventionByRequestHost {
      id: transitionalId
      timezone_name

      run(id: $runId) {
        id: transitionalId
        event {
          id: transitionalId
          title
        }

        signup_changes_paginated(page: $page, per_page: $perPage, filters: $filters, sort: $sort) {
          total_entries
          total_pages
          current_page
          per_page

          entries {
            id: transitionalId
            state
            counted
            bucket_key
            action
            created_at

            previous_signup_change {
              id: transitionalId
              state
              counted
              bucket_key
            }

            run {
              id: transitionalId

              event {
                id: transitionalId
                title

                event_category {
                  id: transitionalId
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
                  id: transitionalId
                  user_con_profile {
                    id: transitionalId
                  }
                }
              }
            }

            user_con_profile {
              id: transitionalId
              name_inverted
              gravatar_enabled
              gravatar_url
            }
          }
        }
      }
    }
  }
`;
