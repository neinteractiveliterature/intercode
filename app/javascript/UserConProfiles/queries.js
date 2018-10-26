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
  currentAbility {
    can_update_privileges_user_con_profile(user_con_profile_id: $id)
  }

  convention {
    ...UserConProfileFormData

    privilege_names
    mail_privilege_names
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

export const userConProfileAdminQuery = gql`
query($id: Int!) {
  myProfile {
    id
    ability {
      can_read_signups
      can_update_user_con_profile(user_con_profile_id: $id)
      can_update_privileges_user_con_profile(user_con_profile_id: $id)
      can_delete_user_con_profile(user_con_profile_id: $id)
      can_become_user_con_profile(user_con_profile_id: $id)
    }
  }

  convention {
    name
    starts_at
    ends_at
    timezone_name
    ticket_name

    user_con_profile_form {
      form_api_json
    }
  }

  userConProfile(id: $id) {
    id
    name
    privileges
    form_response_attrs_json

    ticket {
      id
      charge_id
      payment_note

      payment_amount {
        fractional
        currency_code
      }

      ticket_type {
        id
        description
      }

      provided_by_event {
        id
        title
      }
    }
  }
}
`;

export { fragments };
