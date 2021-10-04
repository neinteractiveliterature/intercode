import { gql } from '@apollo/client';
import { CommonConventionData } from '../queries';

export const EventListEventsQuery = gql`
  query EventListEventsQuery(
    $page: Int
    $pageSize: Int
    $filters: EventFiltersInput
    $sort: [SortInput!]
  ) {
    currentAbility {
      can_read_schedule
    }

    convention: conventionByRequestHost {
      id: transitionalId
      ...CommonConventionData

      events_paginated(page: $page, per_page: $pageSize, filters: $filters, sort: $sort) {
        total_entries
        total_pages
        current_page
        per_page

        entries {
          id: transitionalId
          title
          created_at
          short_blurb_html
          form_response_attrs_json
          my_rating

          event_category {
            id: transitionalId
            name
            team_member_name
          }

          runs {
            id: transitionalId
            starts_at
          }

          team_members {
            id: transitionalId
            display_team_member

            user_con_profile {
              id: transitionalId
              last_name
              name_without_nickname
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
