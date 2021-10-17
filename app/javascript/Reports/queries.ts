import { gql } from '@apollo/client';
import { PricingStructureFields } from '../Store/pricingStructureFields';

export const ReportsMenuQuery = gql`
  query ReportsMenuQuery {
    convention: conventionByRequestHost {
      id: transitionalId
      ticket_mode
      ticket_name
    }
  }
`;

export const AttendanceByPaymentAmountQuery = gql`
  query AttendanceByPaymentAmountQuery {
    convention: conventionByRequestHost {
      id: transitionalId
      ticket_name

      reports {
        ticket_count_by_type_and_payment_amount {
          count

          ticket_type {
            id: transitionalId
            name
            description

            providing_products {
              id: transitionalId
              pricing_structure {
                ...PricingStructureFields
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

  ${PricingStructureFields}
`;

export const EventProvidedTicketsQuery = gql`
  query EventProvidedTicketsQuery {
    convention: conventionByRequestHost {
      id: transitionalId
      ticket_name

      reports {
        event_provided_tickets {
          provided_by_event {
            id: transitionalId
            title
          }

          tickets {
            id: transitionalId

            user_con_profile {
              id: transitionalId
              name_inverted
            }

            ticket_type {
              id: transitionalId
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
    convention: conventionByRequestHost {
      id: transitionalId

      reports {
        events_by_choice {
          event {
            id: transitionalId
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
    convention: conventionByRequestHost {
      id: transitionalId
      signup_counts_by_state {
        state
        count
      }
    }
  }
`;

export const SignupSpySignupChangesQuery = gql`
  query SignupSpySignupChangesQuery(
    $filters: SignupChangeFiltersInput
    $page: Int
    $perPage: Int
    $sort: [SortInput!]
  ) {
    convention: conventionByRequestHost {
      id: transitionalId
      timezone_name

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

          signup {
            id: transitionalId
            choice
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
`;
