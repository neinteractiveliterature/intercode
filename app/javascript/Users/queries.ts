import { gql } from '@apollo/client';

export const UsersTableUsersQuery = gql`
  query UsersTableUsersQuery(
    $page: Int
    $perPage: Int
    $filters: UserFiltersInput
    $sort: [SortInput!]
  ) {
    users_paginated(page: $page, per_page: $perPage, filters: $filters, sort: $sort) {
      total_entries
      total_pages
      current_page
      per_page

      entries {
        id: transitionalId
        name_inverted
        first_name
        last_name
        email
        privileges
      }
    }

    currentAbility {
      can_create_user_con_profiles
    }
  }
`;

export const DetailedUserFields = gql`
  fragment DetailedUserFields on User {
    id: transitionalId
    name
    first_name
    last_name
    email
    privileges

    user_con_profiles {
      id: transitionalId
      email

      ticket {
        id: transitionalId
      }

      signups {
        id: transitionalId
        state
      }

      convention {
        id: transitionalId
        name
        domain
        starts_at
        ticket_name
        timezone_name
        timezone_mode
      }

      staff_positions {
        id: transitionalId
        name
      }
    }
  }
`;

export const UserAdminQuery = gql`
  query UserAdminQuery($id: Int!) {
    user(id: $id) {
      id: transitionalId
      ...DetailedUserFields
    }
  }

  ${DetailedUserFields}
`;

export const MergeUsersModalQuery = gql`
  query MergeUsersModalQuery($ids: [ID!]!) {
    users(transitionalIds: $ids) {
      id: transitionalId
      ...DetailedUserFields
    }
  }
  ${DetailedUserFields}
`;
