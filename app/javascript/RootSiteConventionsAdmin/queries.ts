import { gql } from '@apollo/client';

export const RootSiteConventionsAdminTableQuery = gql`
  query RootSiteConventionsAdminTableQuery($page: Int, $filters: ConventionFiltersInput, $sort: [SortInput!]) {
    conventions_paginated(page: $page, filters: $filters, sort: $sort) {
      total_entries
      total_pages

      entries {
        id
        name
        starts_at
        ends_at
        timezone_name
        timezone_mode

        organization {
          id
          name
        }
      }
    }
  }
`;

export const ConventionDisplayFields = gql`
  fragment ConventionDisplayFields on Convention {
    id
    name
    starts_at
    ends_at
    canceled
    timezone_name
    timezone_mode
    domain
    site_mode
    ticket_mode
    show_event_list
    show_schedule
    email_from
    hidden
    language

    maximum_event_signups {
      timespans {
        start
        finish
        value
      }
    }

    organization {
      id
      name
    }
  }
`;

export const ConventionDisplayQuery = gql`
  query ConventionDisplayQuery($id: ID!) {
    convention: conventionById(id: $id) {
      id
      ...ConventionDisplayFields
    }
  }

  ${ConventionDisplayFields}
`;

export const NewConventionModalQuery = gql`
  query NewConventionModalQuery {
    organizations {
      id
      name
    }
  }
`;
