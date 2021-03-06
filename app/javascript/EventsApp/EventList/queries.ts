/* eslint-disable import/prefer-default-export */
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

    convention {
      id
      ...CommonConventionData

      events_paginated(page: $page, per_page: $pageSize, filters: $filters, sort: $sort) {
        total_entries
        total_pages
        current_page
        per_page

        entries {
          id
          title
          created_at
          short_blurb_html
          form_response_attrs_json
          my_rating

          event_category {
            id
            name
            team_member_name
          }

          runs {
            id
            starts_at
          }

          team_members {
            id
            display_team_member

            user_con_profile {
              id
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
