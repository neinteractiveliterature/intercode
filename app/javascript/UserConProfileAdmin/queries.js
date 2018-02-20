import gql from 'graphql-tag';

const fragments = {};

fragments.userConProfile = gql`
fragment UserConProfileFields on UserConProfile {
  id
  name
  privileges
  form_response_attrs_json
}
`;

export const userConProfileQuery = gql`
query($id: Int!) {
  convention {
    starts_at
    ends_at
    timezone_name
    
    user_con_profile_form {
      form_api_json
    }
  }

  userConProfile(id: $id) {
    ...UserConProfileFields
  }
}

${fragments.userConProfile}
`;

export { fragments };
