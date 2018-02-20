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

fragments.userConProfileFormData = gql`
fragment UserConProfileFormData on Convention {
  starts_at
  ends_at
  timezone_name

  user_con_profile_form {
    form_api_json
  }
}
`;

export const userConProfileQuery = gql`
query($id: Int!) {
  convention {
    ...UserConProfileFormData
  }

  userConProfile(id: $id) {
    ...UserConProfileFields
  }
}

${fragments.userConProfile}
${fragments.userConProfileFormData}
`;

export const myProfileQuery = gql`
query {
  convention {
    ...UserConProfileFormData
  }

  myProfile {
    ...UserConProfileFields
  }
}

${fragments.userConProfile}
${fragments.userConProfileFormData}
`;

export { fragments };
