import { gql } from '@apollo/client';
import { CommonFormFields } from '../../Models/commonFormFragments';

export const EventHistoryQuery = gql`
  query EventHistoryQuery($id: Int!) {
    convention: conventionByRequestHost {
      id: transitionalId
      starts_at
      ends_at
      timezone_name
      timezone_mode

      event(id: $id) {
        id: transitionalId
        title

        event_category {
          id: transitionalId

          event_form {
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

        form_response_changes {
          user_con_profile {
            id: transitionalId
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
  }

  ${CommonFormFields}
`;
