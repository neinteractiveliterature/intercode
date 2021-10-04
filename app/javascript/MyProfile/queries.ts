import { gql } from '@apollo/client';
import { CommonFormFields } from '../Models/commonFormFragments';

export const MyProfileQuery = gql`
  query MyProfileQuery {
    convention: conventionByRequestHost {
      id: transitionalId
      name
      starts_at
      ends_at
      timezone_name
      timezone_mode

      my_profile {
        id: transitionalId
        email
        form_response_attrs_json
        can_have_bio
        gravatar_url
        gravatar_enabled
        bio
        show_nickname_in_bio
        bio_name
        bio_html
        current_user_form_item_viewer_role
        current_user_form_item_writer_role
      }

      user_con_profile_form {
        id: transitionalId
        ...CommonFormFields

        form_sections {
          id: transitionalId
          form_items {
            id: transitionalId
            admin_description
          }
        }
      }
    }
  }

  ${CommonFormFields}
`;
