import gql from 'graphql-tag';

export const signupFields = gql`
fragment SignupFields on Signup {
  id
  state
  counted
  bucket_key
  requested_bucket_key

  run {
    title_suffix
    starts_at
    ends_at

    rooms {
      name
    }

    event {
      title
      team_member_name

      registration_policy {
        buckets {
          key
          name
          anything
        }
      }

      team_members {
        user_con_profile {
          id
        }
      }
    }
  }

  user_con_profile {
    id
    name_without_nickname
    nickname
    birth_date
    email
    address
    city
    state
    zipcode
    country
    day_phone
    evening_phone
    best_call_time
    preferred_contact
  }
}
`;

export const adminSignupQuery = gql`
query AdminSignupQuery($id: Int!) {
  convention {
    timezone_name
  }

  myProfile {
    id
    ability {
      can_update_signup(signup_id: $id)
    }
  }

  signup(id: $id) {
    ...SignupFields
  }
}

${signupFields}
`;
