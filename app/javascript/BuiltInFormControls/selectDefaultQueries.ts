import { gql } from '@apollo/client';

export const DefaultEventsQuery = gql`
  query DefaultEventsQuery($title: String) {
    convention {
      id
      events_paginated(filters: { title: $title }, per_page: 50) {
        entries {
          id
          title
        }
      }
    }
  }
`;

export const DefaultUserConProfilesQuery = gql`
  query DefaultUserConProfilesQuery($name: String) {
    convention {
      id
      user_con_profiles_paginated(filters: { name: $name }, per_page: 50) {
        entries {
          id
          name_without_nickname
          email
        }
      }
    }
  }
`;

export const DefaultUsersQuery = gql`
  query DefaultUsersQuery($name: String) {
    users_paginated(filters: { name: $name }, per_page: 50) {
      entries {
        id
        name
        email
      }
    }
  }
`;
