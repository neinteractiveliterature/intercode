import { gql } from '@apollo/client';

export const ReportsMenuQuery = gql`
  query ReportsMenuQuery {
    convention {
      id
      ticket_mode
      ticket_name
    }
  }
`;

export const AttendanceByPaymentAmountQuery = gql`
  query AttendanceByPaymentAmountQuery {
    convention {
      id
      ticket_name

      reports {
        ticket_count_by_type_and_payment_amount {
          count

          ticket_type {
            id
            name
            description

            pricing_schedule {
              timespans {
                value {
                  fractional
                  currency_code
                }
              }
            }
          }

          payment_amount {
            fractional
            currency_code
          }
        }

        total_revenue {
          fractional
          currency_code
        }
      }
    }
  }
`;

export const EventProvidedTicketsQuery = gql`
  query EventProvidedTicketsQuery {
    convention {
      id
      ticket_name

      reports {
        event_provided_tickets {
          provided_by_event {
            id
            title
          }

          tickets {
            id

            user_con_profile {
              id
              name_inverted
            }

            ticket_type {
              id
              description
            }
          }
        }
      }
    }
  }
`;

export const EventsByChoiceQuery = gql`
  query EventsByChoiceQuery {
    convention {
      id

      reports {
        events_by_choice {
          event {
            id
            title
          }

          choice_counts {
            state
            choice
            count
          }
        }
      }
    }
  }
`;

export const SignupCountsByStateQuery = gql`
  query SignupCountsByStateQuery {
    convention {
      id
      signup_counts_by_state {
        state
        count
      }
    }
  }
`;

export const SignupSpySignupChangesQuery = gql`
  query SignupSpySignupChangesQuery($filters: SignupChangeFiltersInput, $page: Int, $perPage: Int) {
    convention {
      id
      timezone_name

      signup_changes_paginated(
        page: $page
        per_page: $perPage
        filters: $filters
        sort: [{ field: "created_at", desc: true }]
      ) {
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

          signup {
            id
            choice
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
