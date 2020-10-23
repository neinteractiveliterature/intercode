/* eslint-disable import/prefer-default-export */
import { gql } from '@apollo/client';

export const RoomsAdminQuery = gql`
  query RoomsAdminQuery {
    convention: assertConvention {
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
