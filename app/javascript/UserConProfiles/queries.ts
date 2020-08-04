/* eslint-disable import/prefer-default-export */
import { gql } from '@apollo/client';

// partial for now, really trying not to port everything all at once

export const UserConProfileFields = gql`
fragment UserConProfileFields on UserConProfile {
  id
  name
  privileges
  form_response_attrs_json
  gravatar_enabled
  gravatar_url
}
`;
