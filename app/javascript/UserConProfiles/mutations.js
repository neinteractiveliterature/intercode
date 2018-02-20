import gql from 'graphql-tag';
import { fragments } from './queries';

export const updateUserConProfileMutation = gql`
mutation($input: UpdateUserConProfileInput!) {
  updateUserConProfile(input: $input) {
    user_con_profile {
      ...UserConProfileFields
    }
  }
}

${fragments.userConProfile}
`;
