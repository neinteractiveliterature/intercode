import { gql } from '@apollo/client';

export const RootSiteConventionsAdminTableQuery = gql`
  query RootSiteConventionsAdminTableQuery(
    $page: Int
    $filters: ConventionFiltersInput
    $sort: [SortInput!]
  ) {
    conventions_paginated(page: $page, filters: $filters, sort: $sort) {
      total_entries
      total_pages

      entries {
        id: transitionalId
        name
        starts_at
        ends_at
        timezone_name
        timezone_mode

        organization {
          id: transitionalId
          name
        }
      }
    }
  }
`;

export const ConventionDisplayFields = gql`
  fragment ConventionDisplayFields on Convention {
    id: transitionalId
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
      id: transitionalId
      name
    }
  }
`;

export const ConventionDisplayQuery = gql`
  query ConventionDisplayQuery($id: Int!) {
    convention: conventionById(id: $id) {
      id: transitionalId
      ...ConventionDisplayFields
    }
  }

  ${ConventionDisplayFields}
`;

export const NewConventionModalQuery = gql`
  query NewConventionModalQuery {
    organizations {
      id: transitionalId
      name
    }
  }
`;
