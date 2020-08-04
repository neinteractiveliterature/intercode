/* eslint-disable import/prefer-default-export */

import gql from 'graphql-tag';

import { UserConProfileFields } from './queries';

// partial for now

export const UpdateUserConProfile = gql`
mutation UpdateUserConProfile($input: UpdateUserConProfileInput!) {
  updateUserConProfile(input: $input) {
    user_con_profile {
      id
      ...UserConProfileFields
    }
  }
}

${UserConProfileFields}
`;
