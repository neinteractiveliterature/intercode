/* eslint-disable import/prefer-default-export */
import { gql } from '@apollo/client';

export const RoomsAdminQuery = gql`
  query RoomsAdminQuery {
    convention {
      id
      rooms {
        id
        name

        runs {
          id
        }
      }
    }
  }
`;
