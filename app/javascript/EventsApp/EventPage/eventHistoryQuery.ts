/* eslint-disable import/prefer-default-export */
import { gql } from '@apollo/client';
import { CommonFormFields } from '../../Models/commonFormFragments';

export const EventHistoryQuery = gql`
  query EventHistoryQuery($id: Int!) {
    convention {
      id
      starts_at
      ends_at
      timezone_name
      timezone_mode
    }

    event(id: $id) {
      id
      title

      event_category {
        id

        event_form {
          id
          ...CommonFormFields

          form_sections {
            id

            form_items {
              id
              admin_description
            }
          }
        }
      }

      form_response_changes {
        user_con_profile {
          id
          name_without_nickname
        }

        field_identifier
        previous_value
        new_value
        created_at
        updated_at
      }
    }
  }

  ${CommonFormFields}
`;
