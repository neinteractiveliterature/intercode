import { gql } from '@apollo/client';

export const EmailRouteFields = gql`
  fragment EmailRouteFields on EmailRoute {
    id: transitionalId
    receiver_address
    forward_addresses
  }
`;

export const RootSiteEmailRoutesAdminTableQuery = gql`
  query RootSiteEmailRoutesAdminTableQuery(
    $page: Int
    $filters: EmailRouteFiltersInput
    $sort: [SortInput!]
  ) {
    email_routes_paginated(page: $page, filters: $filters, sort: $sort) {
      total_entries
      total_pages

      entries {
        id: transitionalId
        ...EmailRouteFields
      }
    }
  }

  ${EmailRouteFields}
`;
